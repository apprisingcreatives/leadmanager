"use server";

export async function searchApollo(query: string) {
  const apolloKey = process.env.APOLLO_API_KEY;

  if (!apolloKey) {
    throw new Error("Missing APOLLO_API_KEY. Please add it to your .env.local file.");
  }

  try {
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        api_key: apolloKey,
        q_keywords: query,
        page: 1,
        per_page: 5
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Apollo API request failed");
    }

    const data = await response.json();
    
    // Map Apollo's complex response to our simpler Lead format
    return data.people.map((person: any) => ({
      name: `${person.first_name || ""} ${person.last_name || ""}`.trim(),
      company: person.organization?.name || "Unknown Company",
      industry: person.organization?.industry || "Unknown Industry",
      score: 95, // We can compute a real score later based on fit
      val: person.organization?.estimated_num_employees 
        ? person.organization.estimated_num_employees * 100 
        : 10000 // Mock value based on company size
    }));

  } catch (error: any) {
    console.error("Apollo API Error:", error);
    throw new Error(error.message || "Failed to fetch leads from Apollo");
  }
}
