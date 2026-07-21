"use client";

import { useId, useState, type FormEvent } from "react";

type ContactFormProps = {
  publicationTitle?: string;
  className?: string;
};

export function ContactForm({ publicationTitle, className = "" }: ContactFormProps) {
  const idPrefix = useId();
  const firstNameId = `${idPrefix}-first-name`;
  const lastNameId = `${idPrefix}-last-name`;
  const emailId = `${idPrefix}-email`;
  const organisationId = `${idPrefix}-organisation`;
  const messageId = `${idPrefix}-message`;
  const statusId = `${idPrefix}-status`;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [message, setMessage] = useState(
    publicationTitle ? `I would like to request: ${publicationTitle}` : "",
  );
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = publicationTitle
      ? `Publication request: ${publicationTitle}`
      : "Contact Faith Associates";

    const body = [
      `Name: ${firstName.trim()} ${lastName.trim()}`,
      `Email: ${email.trim()}`,
      `Mosque/Organisation: ${organisation.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    const mailto = `mailto:info@faithassociates.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("sent");
  };

  return (
    <div className={`overflow-hidden border border-[var(--field-border)] bg-white ${className}`}>
      <div className="bg-[var(--blue)] px-4 py-3 sm:px-5">
        <h3 className="text-[17px] font-semibold text-white sm:text-[18px]">
          Contact Faith Associates
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 px-4 py-5 sm:px-5 sm:py-6"
        aria-describedby={status === "sent" ? statusId : undefined}
      >
        <div>
          <p className="field-label">
            Name <span className="text-[var(--red)]">*</span>
          </p>
          <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label htmlFor={firstNameId} className="sr-only">
                First name
              </label>
              <input
                id={firstNameId}
                required
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="field mt-0"
              />
              <p className="field-hint">First Name</p>
            </div>
            <div>
              <label htmlFor={lastNameId} className="sr-only">
                Last name
              </label>
              <input
                id={lastNameId}
                required
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="field mt-0"
              />
              <p className="field-hint">Last Name</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor={emailId} className="field-label">
            Email <span className="text-[var(--red)]">*</span>
          </label>
          <input
            id={emailId}
            required
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor={organisationId} className="field-label">
            Mosque/Organisation <span className="text-[var(--red)]">*</span>
          </label>
          <input
            id={organisationId}
            required
            name="organisation"
            autoComplete="organization"
            value={organisation}
            onChange={(event) => setOrganisation(event.target.value)}
            className="field"
          />
        </div>

        <div>
          <label htmlFor={messageId} className="field-label">
            Your Message <span className="text-[var(--red)]">*</span>
          </label>
          <textarea
            id={messageId}
            required
            name="message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="field min-h-[120px] resize-y"
          />
        </div>

        <div className="flex justify-center pt-1">
          <button type="submit" className="btn-primary px-8">
            Submit
          </button>
        </div>

        {status === "sent" ? (
          <p id={statusId} role="status" className="text-center text-sm text-[var(--muted)]">
            Your email client should open with the message ready to send.
          </p>
        ) : null}
      </form>
    </div>
  );
}
