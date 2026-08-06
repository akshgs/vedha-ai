"""
app package initialization
"""
# Note: app.ai subpackage is NOT eagerly imported here.
# Individual routers import their AI service dependencies directly.
# Eager import caused a fatal startup crash due to LangChain version incompatibility.
