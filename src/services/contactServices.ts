import prisma from "../config/db";

export const identifyContact = async (email?: string | null, phoneNumber?: string | null) => {
  if (!email && !phoneNumber) {
    throw new Error("Email or Phone Number required");
  }

  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });

  let primaryContact = existingContacts.find((contact) => contact.linkPrecedence === "primary") || existingContacts[0];
  let secondaryContacts: any[] = [];

  if (primaryContact) {
    // Get all secondary contacts linked to this primary
    secondaryContacts = await prisma.contact.findMany({
      where: { linkedId: primaryContact.id },
    });

    // If a new email/phone is introduced that does not exist in any records, create a new secondary contact
    const isNewEmail = email && !existingContacts.some((contact) => contact.email === email);
    const isNewPhone = phoneNumber && !existingContacts.some((contact) => contact.phoneNumber === phoneNumber);

    if (isNewEmail || isNewPhone) {
      const newSecondaryContact = await prisma.contact.create({
        data: {
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkedId: primaryContact.id,
          linkPrecedence: "secondary",
        },
      });
      secondaryContacts.push(newSecondaryContact);
    }
  } else {
    // No existing contact found, create a new primary contact
    primaryContact = await prisma.contact.create({
      data: {
        email: email || null,
        phoneNumber: phoneNumber || null,
        linkPrecedence: "primary",
      },
    });
  }

  if (!primaryContact) {
    throw new Error("Failed to create or find a primary contact.");
  }


  // Format the response
  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails: [primaryContact.email, ...secondaryContacts.map((c) => c.email)].filter(Boolean),
      phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map((c) => c.phoneNumber)].filter(Boolean),
      secondaryContactIds: secondaryContacts.map((c) => c.id),
    },
  };
};


