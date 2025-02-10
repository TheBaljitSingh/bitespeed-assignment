import prisma from "../config/db";

export const identifyContact = async (email?: string, phoneNumber?: string) => {
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
         email? {email} : {} ,
        phoneNumber? {phoneNumber}:{}
      ]
    }
  });

  if (existingContacts.length === 0) {
    // No existing contact, create a new primary contact
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });

    return {
      contact: {
        primaryContatctId: newContact.id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: []
      }
    };
  }

  // Find primary contact
  let primaryContact = existingContacts.find(c => c.linkPrecedence === "primary") || existingContacts[0];

  // Get all related contacts (secondary ones)
  const allContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id }
      ]
    }
  });

  const emails: string[] = [];
  const phoneNumbers: string[] = [];
  const secondaryContactIds: number[] = []; 

  allContacts.forEach(contact => {
    if (contact.email && !emails.includes(contact.email)) emails.push(contact.email);
    if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) phoneNumbers.push(contact.phoneNumber);
    if (contact.id !== primaryContact.id) secondaryContactIds.push(contact.id);
  });

  // If the provided email/phone is new, create a secondary contact linked to the primary
  const isNewEmail = email && !emails.includes(email);
  const isNewPhone = phoneNumber && !phoneNumbers.includes(phoneNumber);

  if (isNewEmail || isNewPhone) {
    const newSecondary = await prisma.contact.create({
      data: {
        email: isNewEmail ? email : null,
        phoneNumber: isNewPhone ? phoneNumber : null,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary"
      }
    });

    secondaryContactIds.push(newSecondary.id);
    if (newSecondary.email) emails.push(newSecondary.email);
    if (newSecondary.phoneNumber) phoneNumbers.push(newSecondary.phoneNumber);
  }

  return {

    // returning in format
    contact: {
      primaryContatctId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  };
};


