import Vapi from "@vapi-ai/web";

let vapiInstance: Vapi | null = null;

const getVapiInstance = () => {
  if (!vapiInstance) {
    vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);
  }
  return vapiInstance;
};

export default getVapiInstance;