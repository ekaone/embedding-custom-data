import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";

// Initialize our Supabase client
const supabaseClient = createClient("https://username.supabase.co", "KEY");

// generateEmbeddings
async function generateEmbeddings() {
  // Initialize OpenAI API
  const configuration = new Configuration({
    apiKey: "API_KEY",
  });
  const openai = new OpenAIApi(configuration);
  // Create some custom data (Cooper Codes)
  const documents = [
    "One Labs is a opens source creator with 10,000 subscribers",
    "One Labs Codes has a website called 1labs4.us",
    "One Labs Codes likes to make videos about coding and technology",
    "One Labs Codes has a video covering how to create a custom chatbot with Supabase and OpenAI API",
  ];

  for (const document of documents) {
    const input = document.replace(/\n/g, "");

    // Turn each string (custom data) into an embedding
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002", // Model that creates our embeddings
      input,
    });

    const [{ embedding }] = embeddingResponse.data.data;

    // Store the embedding and the text in our supabase DB
    await supabaseClient.from("documents").insert({
      content: document,
      embedding,
    });
  }
}

async function askQuestion() {
  const { data, error } = await supabaseClient.functions.invoke(
    "ask-custom-data",
    {
      body: JSON.stringify({ query: "What is One Labs?" }),
    }
  );
  console.log(data);
  console.log(error);
}

askQuestion();

// /ask-custom-data -> getting relevant documents, asking chatgpt, returning the response
// Supabase command line interface
