import { valid } from "@/engine/core/http/validator";
import { ok, created, fail } from "@/engine/core/http/responses";
import { companySchema, orgUpdateSchema } from "@/engine/core/validation/schemas/company.schema";
import { noAuth, requireAdmin, requireAuth } from "@/engine/core/http/auth-guard";  

export const coController = {
  async company(req:Request) { 
   
       return ok({
          id: 1,
          name: "Sample Company",
          email: "company@example.com",
          logo: "",
          description: "This is a sample company description.",
        });

 


  },
  
 





};
