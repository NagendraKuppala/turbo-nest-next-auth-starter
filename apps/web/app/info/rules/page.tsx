import React from 'react';

export default function CommunityRulesPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">KwikDeals Community Rules &amp; Guidelines</h1>
      <p className="text-sm text-muted-foreground mb-8">Effective Date: March 16, 2025</p>

      <section className="mb-8">
        <p className="mb-6">
          Welcome to KwikDeals.net! To ensure a positive and respectful environment for all members, we have established the following community rules. 
          By participating in our platform, you agree to abide by these guidelines. Violations may result in warnings, account suspension, or permanent bans.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Forum &amp; Community Rules</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">1. Respectful Conduct</h3>
          <div className="pl-4 mb-2">
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✅</span> 
              <span>Be kind and respectful to all members.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Personal attacks, hate speech, discrimination (based on race, gender, religion, sexual orientation, or nationality) will not be tolerated.</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">2. No Spam or Fraudulent Content</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Do not post misleading, fraudulent, or deceptive deals (e.g., coupon hacking, fake discounts).</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Do not engage in referral solicitation, multi-level marketing, or pyramid schemes.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Do not manipulate tipping (e.g., creating fake accounts to send or receive tips).</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">3. Posting Deals &amp; Discussions</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✅</span> 
              <span>Only post valid deals that can be verified.</span>
            </p>
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✅</span> 
              <span>If posting a coupon, ensure it is publicly available and mention the source.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Do not post entire articles from other websites (a short excerpt with a source link is allowed).</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Avoid duplicate deal postings—search before submitting.</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">4. Self-Promotion &amp; Advertising</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>You may not promote your own business, service, or website without approval.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Sponsored deals must be submitted through KwikDeals Featured Deals.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>No advertising Buy/Sell/Trade posts except within designated sections.</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">5. Privacy &amp; Security</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Do not share personal information (yours or others) such as addresses, phone numbers, or private messages.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>No phishing, scams, or attempts to collect user information unlawfully.</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">6. Use of Multiple Accounts</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>You are allowed only one account per person. Contact support if you need assistance with your account.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Creating multiple accounts to manipulate votes, discussions, or tips is strictly prohibited.</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">7. Prohibited Content</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>No NSFW, violent, overly graphic, or offensive content.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>No discussions promoting illegal activities, including piracy, fraud, or counterfeit goods.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>No political or religious debates outside of designated forums.</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">8. Tipping Rules</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✅</span> 
              <span>Users can tip deal posters if a deal helped them save money.</span>
            </p>
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✅</span> 
              <span>Tips are processed monthly as gift card payouts (minimum payout: $25, with excess carried forward).</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>Do not manipulate tipping by engaging in artificial transactions.</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">9. Third-Party Links &amp; Shortened URLs</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✅</span> 
              <span>You may post links to deals from reputable retailers.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>URL shortening services are not allowed to ensure transparency.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">User Profile Rules</h2>

        <div className="mb-8">
          <h3 className="text-xl font-medium mb-3">Avatar Policy</h3>
          <div className="pl-4">
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✅</span> 
              <span>Choose appropriate avatars.</span>
            </p>
            <p className="flex items-start">
              <span className="text-red-600 mr-2">❌</span> 
              <span>No offensive, NSFW, or copyrighted avatars.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Infraction &amp; Ban System</h2>
        <p className="mb-4">
          KwikDeals enforces a 3-strike policy for rule violations. The severity of infractions will determine the consequences:
        </p>
        
        <ul className="list-none space-y-3 pl-4 mb-4">
          <li><span className="font-medium">Level 1: Warning</span> – Minor rule violations result in a warning.</li>
          <li><span className="font-medium">Level 2: Moderation Mode</span> – Users with 10+ infraction points will have their posts manually reviewed before being published.</li>
          <li><span className="font-medium">Level 3: Temporary Suspension</span> – Users reaching 15+ points will be temporarily suspended.</li>
          <li><span className="font-medium">Permanent Ban</span> – Repeated violations or severe offenses (e.g., scams, abuse, or illegal activities) will result in an immediate permanent ban.</li>
        </ul>
        
        <p className="flex items-start">
          <span className="text-green-600 mr-2">✅</span> 
          <span><span className="font-medium">Appeals:</span> You may appeal infractions by contacting an Administrator or emailing support@kwikdeals.net.</span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Final Note</h2>
        <p className="mb-4">
          KwikDeals reserves the right to modify these rules at any time without prior notice. Continued use of the platform implies acceptance of any updates.
        </p>
        <p className="mb-6">
          For questions or concerns, contact us at <a href="mailto:support@kwikdeals.net" className="text-primary underline">support@kwikdeals.net</a>.
        </p>
        <p className="font-medium text-lg">Happy deal hunting! 🎉</p>
      </section>
    </div>
  );
}