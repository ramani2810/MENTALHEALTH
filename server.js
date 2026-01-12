const{Configuration,OpenAIApi}=require("openai")
const config= new Configuration({
    apiKey:"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"
});
const openai= new OpenAIApi(config);
const runPrompt =async()=> {
    const prompt="how is your mood today."
    {
        "Q": "question",
        "A":"answer"
    }
    ';
    const response = await openai.createCompletion({
        modal: "text-davinci-003",
        prompt: prompt,
        max_tokens:2048,
        temperature: 1,
    });
    console.log(response.data.choices[0].text);
};
runPrompt();

