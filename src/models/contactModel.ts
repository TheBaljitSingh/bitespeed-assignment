import { supabase } from "../config/db";
import { Contact } from "../types/contactTypes";

export class ContactModel {
    
  static async findMatchingContacts(email: string, phoneNumber: string): Promise<Contact[]> {
    const { data, error } = await supabase
      .from("Contact")
      .select("*")
      .or(`email.eq.${email},phoneNumber.eq.${phoneNumber}`);

    if (error) throw error;
    return data || [];
  }

  static async createContact(contact: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase.from("Contact").insert([contact]).select("*").single();
    if (error) throw error;
    return data;
  }

  static async updateContact(id: number, updates: Partial<Contact>): Promise<void> {
    await supabase.from("Contact").update(updates).eq("id", id);
  }


}
