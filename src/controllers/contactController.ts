// import { Request, Response } from "express";
import { ContactModel } from "../models/contactModel";
import { IdentifyResponse } from "../types/contactTypes";

export const identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber required" });
  }

  try {
    const contacts = await ContactModel.findMatchingContacts(email, phoneNumber);

    let primaryContact;
    let secondaryContacts: any[] = [];

    if (contacts.length > 0) {
      primaryContact = contacts.find(c => c.linkPrecedence === "primary") || contacts[0];
      secondaryContacts = contacts.filter(c => c.id !== primaryContact.id);
    } else {
      primaryContact = await ContactModel.createContact({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });
    }

    const response: IdentifyResponse = {
      primaryContactId: primaryContact.id,
      emails: [primaryContact.email, ...secondaryContacts.map(c => c.email)].filter(Boolean),
      phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)].filter(Boolean),
      secondaryContactIds: secondaryContacts.map(c => c.id),
    };

    return res.json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
