from app.ai.llm.llm_factory import LLMFactory

class BaseAgent:
    """Base AI Agent template supporting reasoning and tool registration."""
    
    def __init__(self, name: str, system_instruction: str):
        self.name = name
        self.system_instruction = system_instruction
        self.llm = LLMFactory.get_chat_model(temperature=0.3)
        self.tools = {}

    def add_tool(self, name: str, func):
        self.tools[name] = func

    async def execute(self, user_query: str) -> str:
        """Executes LLM reasoning loops."""
        prompt = f"System: {self.system_instruction}\n\nUser: {user_query}"
        response = await self.llm.ainvoke(prompt)
        return response.content

class CareerMentorAgent(BaseAgent):
    """Specialized AI Agent assisting in career mentorship and paths."""
    
    def __init__(self):
        super().__init__(
            name="CareerMentor",
            system_instruction="You are an expert AI Career Mentor. Assist students with job options, salaries, and resume suggestions."
        )

class CodingSpecialistAgent(BaseAgent):
    """Specialized AI Agent analyzing software algorithms and bug diagnostics."""
    
    def __init__(self):
        super().__init__(
            name="CodingSpecialist",
            system_instruction="You are an expert Senior Coding Assistant. Help students debug, optimize, and evaluate computational Big-O complexities."
        )
