from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import openai, cartesia, deepgram, noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from livekit.agents.llm import function_tool
from dotenv import load_dotenv

load_dotenv()

@function_tool
async def recommend_books(ctx, genre: str):
    # Use LLM to generate live book recommendations
    # await ctx.session.tts.set_voice("156fb8d2-335b-4950-9cb3-a2d33befec77") 

    prompt = (
        f"Please recommend 3 popular books in the {genre} genre. "
        "List only the book titles separated by commas."
    )
    response = await ctx.llm.generate(prompt)
    # Parse and clean response text
    books = [b.strip() for b in response.text.split(",")]
    return {"books": books}

@function_tool
async def recommend_movies(ctx, genre: str):
    # Use LLM to generate live movie recommendations
    # await ctx.session.tts.set_voice("794f9389-aac1-45b6-b726-9d9369183238")
    prompt = (
        f"Please recommend 3 popular movies in the {genre} genre. "
        "List only the movie titles separated by commas."
    )
    response = await ctx.llm.generate(prompt)
    movies = [m.strip() for m in response.text.split(",")]
    return {"movies": movies}


class RecommenderAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=(
                "You are a friendly voice assistant that recommends books or movies based on genre. "
                "Start by asking the user whether they want a book or a movie recommendation. "
                "If they choose 'book', call the `recommend_books` tool. "
                "If they choose 'movie', call the `recommend_movies` tool. "
                "Then, ask them for the genre and pass it as a parameter to the appropriate tool. "
                "Respond to the user with the list of recommended items in a friendly tone."
                "If the genre is not understood, say: 'Hmm, I'm not sure I recognize that genre. Could you try another?'"
                "Respond in the same language the user uses."
        )
    )


async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()

    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="en"),
        llm=openai.LLM(model="gpt-4o-mini"),
        # tts=cartesia.TTS(),
        tts=deepgram.TTS(model="aura-asteria-en"),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    await session.start(
        room=ctx.room,
        agent=RecommenderAgent(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await session.generate_reply(
        instructions="Hi there! Would you like a book or movie recommendation today?"
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
