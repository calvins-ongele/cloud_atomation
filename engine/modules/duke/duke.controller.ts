import { requireAuth } from "@/engine/core/http/auth-guard"; 
import { ok, created, fail, blob } from "@/engine/core/http/responses";  
import { ConfigType } from "@/engine/lib/ConfigType";
import CloudAutomation from "@/engine/lib/puppet.sender";
import BookingAutomation from "@/engine/lib/booking.sender";
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
   const form = await req.json();
   const comma_emails = form.emails ?? '';
   const emails = comma_emails.split(",").map((email:string) => email.trim()).filter((email:string) => email.length > 0);
   const endpoint = form.endpoint ?? "http://localhost:3000/duke-feedback";
   const isBooking = form.bookingLink || '';
   const b = ''; 

   try {
   const chromium_profile = form.chromium_profile.replaceAll(' ', '-').toLowerCase() || 'duke_profile';
   const profileDir = path.join(process.cwd(), 'engine', 'modules', 'duke', chromium_profile);
   //console.log(\n Using chromium profile directory: ${profileDir});return;
   // send tail end feedback via form

   if (!form.projectId || !emails.length) {
      return fail(new Error(
         "Missing required fields: projectId and emails are required.",
      ));
   }

   const debug = form.debug === "true" || form.debug === true || form.debug === "1" || form.debug === 1 || form.debug === "yes" || form.debug === "on" || form.debug === "enabled" || form.debug === "enable" || form.debug === "active" || form.debug === "activated" || form.debug === "true" || form.debug === "t" || form.debug === "y" ;
   
   const config:ConfigType = {
      projectId: form.projectId,
      emailsToAdd: emails,
      profileDir,
      logDir: path.join(profileDir, 'logs'),
      timeout: Number(form.timeout ?? 30000),
      debug:debug, 
      bookingUrl:isBooking ?? '',
      viewport:{ width: 640, height: 480 },
   }
   
  const automation: CloudAutomation = new CloudAutomation(config);
  const bookAutomation: BookingAutomation = new BookingAutomation(config);

  try {
      let result;
      let succuesses;

      if (isBooking.length > 0) {
         result = await automation.run();
         succuesses = result.successful ?? []
      } else {
         result = await bookAutomation.run();
         succuesses = result?.emails ?? []
      }
      // find successful feedback from the automation and return it to the client
      //const results = { successful: [eg email] as string[], failed: [] as string[] };
   
      const successfulEmails = succuesses.join(",");
      
      //just fire and forget the feedback to the endpoint. We don't want to wait for it to complete before returning a response to the client.
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ successfulEmails, isBooking }),
      });

      return ok({
         message: "Duke automation initiated successfully.",
      });

      // Log human-readable end time
const endTime = new Date();
console.log(`Process ended at: ${endTime.toLocaleTimeString()}`);
 

  } catch(cbError:any) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ failedEmails:emails }),
      });

      console.error('\n Process failed:', cbError.message);
      return fail(new Error(`Duke automation failed: ${cbError.message}` ));
  }

} catch (error:any) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ failedEmails:emails }),
      });
   console.error('\n Error initiating Duke automation:', error.message);
   return fail(new Error(`Error initiating your automation: ${error.message}`));
}
  
  
     

    
}















};