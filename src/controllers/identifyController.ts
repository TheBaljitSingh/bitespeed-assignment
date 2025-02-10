import { Request, Response } from "express";
import { identifyContact } from "../services/contactServices";

export const identify = async (req: Request, res: Response): Promise<void> => {  
  // return type is important here void: this is typescript
  try {
    const { email, phoneNumber } = req.body;




    const result = await identifyContact(email, phoneNumber);
    res.json({result}); // added the curly braces
  } catch (error: any) {
    res.status(400).json({ error: error.message }); 
  }
};