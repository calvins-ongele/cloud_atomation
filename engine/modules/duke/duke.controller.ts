import { requireAuth } from "@/engine/core/http/auth-guard"; 
import { ok, created, fail, blob } from "@/engine/core/http/responses";  
import { ConfigType } from "@/engine/lib/ConfigType";
import GCloudAutomation from "@/engine/lib/puppet.sender";
import path from "path"; 

export const DukeController = {
   
   
async initiate(req:Request) {
   /**
    * form data expected:
    * {
    *   projectId: string,
    *  emails: string, // comma-separated
    *  chromium_profile: string, // optional
    *  endpoint: string // optional
    * timeout: number // optional
    * debug: boolean // optional
    * }
    */
   try {
   const form = await req.json();
   const emails = form.emails.split(",").map((email:string) => email.trim()).filter((email:string) => email.length > 0);
   const chromium_profile = form.chromium_profile.replace(' ', '-').toLowerCase() || 'duke_profile';
   const profileDir = path.join(__dirname, chromium_profile);//submit via form
   //console.log(`\n Using chromium profile directory: ${profileDir}`);return;
   // send tail end feedback via form
   const endpoint = form.endpoint ?? "http://localhost:3000/duke-feedback";

   if (!form.projectId || !emails.length) {
      return fail({
         message: "Missing required fields: projectId and emails are required.",
      });
   }

   const debug = form.debug === "true" || form.debug === true || form.debug === "1" || form.debug === 1 || form.debug === "yes" || form.debug === "on" || form.debug === "enabled" || form.debug === "enable" || form.debug === "active" || form.debug === "activated" || form.debug === "true" || form.debug === "t" || form.debug === "y" ;
   
   const config:ConfigType = {
      projectId: form.projectId,
      emailsToAdd: emails,
      profileDir,
      logDir: path.join(profileDir, 'logs'),
      timeout: Number(form.timeout ?? 30000),
      debug:debug,
   }
   
  const automation: GCloudAutomation = new GCloudAutomation(config);

  try {
      const result = await automation.run();
      // find successful feedback from the automation and return it to the client
      //const results = { successful: [eg email] as string[], failed: [] as string[] };
      const succuesses = result.successful ?? [];
      const successfulEmails = succuesses.join(",");
      
      //just fire and forget the feedback to the endpoint. We don't want to wait for it to complete before returning a response to the client.
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ successfulEmails }),
      });

      return ok({
         message: "Duke automation initiated successfully.",
      });

  } catch(cbError:any) {
      console.error('\n Process failed:', cbError.message);
      return fail({message: `Duke automation failed: ${cbError.message}`});
  }

} catch (error:any) {
   console.error('\n Error initiating Duke automation:', error.message);
   return fail({message: `Error initiating Duke automation: ${error.message}`});
}
  
  
     

    
}















};
