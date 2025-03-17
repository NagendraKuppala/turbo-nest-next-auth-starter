import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">KwikDeals Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Effective Date: March 16, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          KwikDeals (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is
          committed to protecting your privacy. This Privacy Policy applies to
          our web application (KwikDeals.net), mobile applications, and related
          services (collectively, the &quot;Services&quot;). By using our
          Services, you agree to the practices described herein. This policy is
          designed to comply with applicable privacy laws, including Canadian
          federal and provincial regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Information We Collect
        </h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Personal Information</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">Account Data:</span> When you sign up,
            we collect your name, email address, username, and password (using
            Google OAuth and NeonDB).
          </li>
          <li>
            <span className="font-medium">Profile Information:</span> Optional
            details such as your bio and profile picture may be provided by you.
          </li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">
          Transactional and Interaction Data
        </h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">Deal Content and Interactions:</span>{" "}
            This includes deals posted, comments, upvotes/downvotes, and
            discussion contributions.
          </li>
          <li>
            <span className="font-medium">Tipping Feature:</span>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                Tip Transaction Data: When you tip a deal poster, we record the
                transaction amount, timestamp, and the recipient&apos;s
                username.
              </li>
              <li>
                Payout Details: Tips are aggregated on a monthly basis. For
                example, if a deal poster earns $27, a payout of $25 will be
                processed and the remaining $2 will be accumulated for the next
                period. Similarly, earnings of $32 result in a $30 payout with
                $2 carried forward, and $46 results in a $40 payout with a $6
                balance carried forward until the minimum threshold of $25 is
                met.
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Usage and Device Data</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">Technical Information:</span> We
            collect your IP address, browser type, device identifiers, cookies,
            and activity logs.
          </li>
          <li>
            <span className="font-medium">Location Data:</span> Device location
            may be collected (if you opt in) to provide localized deal
            recommendations.
          </li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Automated Collection</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">Tracking Technologies:</span> Cookies,
            web beacons, and analytics tools (e.g., Google Analytics) help us
            track usage patterns and improve our Services. You can opt out of
            your usage data being included in our reports from Google Analytics
            and customize Google&apos;s Display Network ads. Please visit{" "}
            <a
              href="https://myadcenter.google.ca/home?sasb=true&ref=ad-settings"
              className="text-primary underline"
            >
              Google&apos;s Ad Settings
            </a>{" "}
            and{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-primary underline"
            >
              Google Analytics Opt-out Browser Add-on.
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          2. How We Use Your Information
        </h2>
        <p className="mb-4">Your information is used to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Operate and improve the Services (deal listings, voting,
            discussions, and search functionalities).
          </li>
          <li>
            Process and securely record tip transactions and handle monthly
            payouts.
          </li>
          <li>
            Personalize content and advertising based on your preferences.
          </li>
          <li>
            Communicate with you regarding account updates, promotions, and
            important notices.
          </li>
          <li>Enhance security and prevent fraudulent activities.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          3. Sharing Your Information
        </h2>
        <p className="mb-4">
          We share your data in the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">With Deal Posters:</span> Tip details
            are shared with deal posters, with your username anonymized unless
            you choose otherwise.
          </li>
          <li>
            <span className="font-medium">Service Providers:</span> Third-party
            vendors such as payment processors (Stripe/PayPal), hosting
            providers (Cloudflare, AWS, NeonDB), and analytics services (Google
            Analytics) access data only to perform tasks on our behalf.
          </li>
          <li>
            <span className="font-medium">Legal Compliance:</span> We may
            disclose your information if required by law or to protect our
            rights.
          </li>
          <li>
            <span className="font-medium">Business Transfers:</span> In the
            event of a merger, acquisition, or sale, your data may be
            transferred to the new owners.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-4">We take data security seriously by implementing:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Encryption:</span> Data transmitted
            between your device and our servers is encrypted using SSL/TLS.
          </li>
          <li>
            <span className="font-medium">Secure Authentication:</span> We
            employ Google OAuth and JWT security protocols.
          </li>
          <li>
            <span className="font-medium">Access Controls:</span> Regular audits
            and strict access controls help protect your data.
          </li>
          <li>
            <span className="font-medium">Third-Party Safeguards:</span> Our
            service providers adhere to high security standards.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
        <p className="mb-4">Our Services integrate with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Payment Processors:</span> Stripe and
            PayPal handle your financial transactions. Please review their
            respective privacy policies for more information.
          </li>
          <li>
            <span className="font-medium">Authentication Providers:</span>{" "}
            Google and other social login options are used to streamline account
            access; their privacy practices apply to the data shared with them.
          </li>
          <li>
            <span className="font-medium">Analytics Providers:</span> Google
            Analytics is used to monitor usage; you may opt out through
            Google&apos;s available tools.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          6. Your Rights and Choices
        </h2>
        <p className="mb-4">
          Under applicable privacy laws, you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Access and Correct Your Data:</span>{" "}
            Review and update your personal information via account settings.
          </li>
          <li>
            <span className="font-medium">Request Deletion:</span> Submit a
            request to delete your data by contacting us at
            support@kwikdeals.net. Note that some data may be retained for legal
            or business purposes.
          </li>
          <li>
            <span className="font-medium">Opt-Out:</span> Manage your
            communication preferences and disable cookies through your browser
            settings.
          </li>
          <li>
            <span className="font-medium">Data Portability:</span> Request a
            copy of your personal data in a portable format.
          </li>
          <li>
            <span className="font-medium">Children&apos;s Privacy:</span> Our
            Services are not intended for users under the age of 16. If you
            believe we have inadvertently collected data from a minor, please
            contact us immediately.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          7. Provincial and International Privacy Rights
        </h2>
        <p className="mb-4">
          We acknowledge that additional rights may be afforded under provincial
          laws (e.g., Quebec&apos;s privacy regulations) and international
          privacy regulations. Please refer to your local laws for more details
          on your rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Policy Updates</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. All changes will
          be posted on KwikDeals.net with an updated effective date. Your
          continued use of the Services after any changes indicates your
          acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding this Privacy Policy or
          our data practices, please contact us at:
          <br />
          Email:{" "}
          <a
            href="mailto:support@kwikdeals.net"
            className="text-primary underline"
          >
            support@kwikdeals.net
          </a>
        </p>
      </section>
    </div>
  );
}
