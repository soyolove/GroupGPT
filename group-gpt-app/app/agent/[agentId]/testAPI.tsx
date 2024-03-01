"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestAgent() {
  async function testAgent(formData: FormData) {
    // "use server";
    const agentId = formData.get("agentId");
    const apiKey = formData.get("apiKey");

    const req = await fetch(
      `/api/agent/${agentId}/chat`,

      {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`, // 将 API 密钥放在 Authorization 头中
          },
        body: JSON.stringify({
          messages:[{role:'user',content:'Hi'}]
        }),
      }
    );

    const json = await req.json();
    setResult(JSON.stringify(json));
  }

  const [result, setResult] = useState("");

  return (
    <div>
      <form action={testAgent}>
        <input type="text" name="agentId" placeholder="this is agent ID" />
        <input type="text" name="apiKey" placeholder="api-key" />

        <Button type="submit">Click here to test</Button>
      </form>
      <div>{result}</div>
    </div>
  );
}
