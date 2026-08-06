import os
import json
from groq import Groq
from app.core.config import settings

class UnifiedLLM:
    """
    Centralized LLM client for Vedha AI. Uses Groq as primary engine,
    and fallback mechanisms if Groq token limit is reached or offline.
    """
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY")
        self.client = None
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"⚠️ Failed to init Groq client: {e}")

    def generate(self, prompt: str, system_prompt: str = "You are Vedha AI career coach.", model: str = "llama3-8b-8192", temperature: float = 0.2) -> str:
        if self.client:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    model=model,
                    temperature=temperature
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                print(f"❌ Groq generation failed: {e}. Falling back to rule-based mock engine.")
        
        return self._mock_fallback(prompt, system_prompt)

    def generate_structured(self, prompt: str, system_prompt: str, pydantic_schema, model: str = "llama3-8b-8192") -> dict:
        """
        Produce structured JSON output matching a Pydantic schema
        """
        full_system = f"{system_prompt}\nYou MUST output valid JSON conforming strictly to this JSON Schema: {json.dumps(pydantic_schema.model_json_schema())}"
        response_text = self.generate(prompt, full_system, model)
        
        # Clean markdown wrappers if any
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        try:
            return json.loads(response_text)
        except Exception:
            # Fallback mock template matching the Pydantic schema structure
            return self._mock_schema_fallback(pydantic_schema)

    def _mock_fallback(self, prompt: str, system_prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "two sum" in prompt_lower or "coding" in prompt_lower:
            return "Ensure array indices boundaries are managed correctly. A hash map offers O(n) time complexity over O(n^2) nested loops."
        if "resume" in prompt_lower:
            return "ATS Analysis: Score: 85. Suggestion: Add metrics detailing performance increases in projects."
        return "Vedha AI Mentor: Focus on developing core backend rest APIs with FastAPI and databases like PostgreSQL."

    def _mock_schema_fallback(self, schema) -> dict:
        # Generate basic dictionary mapping to type expectations
        mock_obj = {}
        for key, val in schema.model_fields.items():
            annotation = str(val.annotation)
            if "int" in annotation:
                mock_obj[key] = 85
            elif "list" in annotation or "List" in annotation:
                mock_obj[key] = ["FastAPI", "Docker"]
            else:
                mock_obj[key] = f"Mock description for {key}"
        return mock_obj

llm_client = UnifiedLLM()
