import {
    GoogleGenerativeAI
}
    from "@google/generative-ai";


const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY!
    );


const model =
    genAI.getGenerativeModel({

        model:
            "gemini-2.5-flash"

    });



const MAX_RETRIES = 3;

const TIMEOUT_MS = 10000;



function timeoutPromise<T>(

    promise: Promise<T>,

    timeout: number

): Promise<T> {


    return Promise.race([


        promise,


        new Promise<T>((_, reject) => {


            setTimeout(() => {


                reject(
                    new Error(
                        "Gemini timeout"
                    )
                );


            }, timeout);


        })


    ]);


}




async function retryGeminiCall<T>(

    fn: () => Promise<T>

): Promise<T> {


    let lastError;


    for (
        let attempt = 1;
        attempt <= MAX_RETRIES;
        attempt++
    ) {


        try {


            console.log(
                `Gemini attempt ${attempt}`
            );


            return await timeoutPromise(

                fn(),

                TIMEOUT_MS

            );


        }

        catch (error) {


            lastError = error;


            console.log(
                `Gemini failed attempt ${attempt}`
            );


            if (
                attempt === MAX_RETRIES
            ) {

                throw error;

            }


        }

    }


    throw lastError;

}




class AIClient {


    async generateAIExplanation(

        prompt: string

    ) {


        try {


            const result =

                await retryGeminiCall(

                    () =>


                        model.generateContent(
                            prompt
                        )


                );



            return result
                .response
                .text();



        }


        catch (error) {


            console.error(

                "Gemini failed completely:",
                error

            );


            return null;


        }


    }


}



export default new AIClient();