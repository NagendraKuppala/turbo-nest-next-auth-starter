import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">About Us</h1>
      <p className="text-xl text-primary font-medium mb-6">KwikDeals - Where Savvy Shoppers Discover &amp; Share Great Deals</p>
      
      <section className="mb-10">
        <p className="mb-4">
          Welcome to KwikDeals, the ultimate community-driven deal-sharing platform in Canada! Whether you&apos;re on the hunt for the best discounts, 
          sharing hidden gems, or tipping deal posters for helping you save money, KwikDeals makes shopping smarter and more rewarding.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">Why KwikDeals?</h2>
        
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-3xl">💰</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Amazing Deals, Every Day</h3>
              <p>
                Our users uncover and share unbeatable discounts—from everyday essentials to high-end tech. 
                Whether it&apos;s an exclusive price drop on your favorite gadgets or a grocery deal that slashes your monthly expenses, 
                you&apos;ll always find ways to save.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 text-3xl">✅</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Trusted Community Insights</h3>
              <p>
                Real shoppers, real experiences. Our platform thrives on community contributions—users verify, comment, 
                and vote on deals to ensure the best savings make it to the top. Need expert advice? Our members provide insights 
                on product quality, retailer reliability, and stacking deals for maximum savings.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 text-3xl">🔍</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Smarter Shopping, Bigger Savings</h3>
              <p>
                Shopping is more than just buying—it&apos;s about making informed decisions. With KwikDeals, you&apos;ll discover trending deals, 
                read user feedback, and learn pro tips on using coupons, cashback, and reward programs to get the best value for your money.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 text-3xl">💸</div>
            <div>
              <h3 className="text-xl font-medium mb-2">Tipping: A Unique Way to Give Back</h3>
              <p>
                Did a deal help you save big? Say thank you by tipping the deal poster! Our unique tipping system allows you 
                to support deal hunters who bring you the best savings. Tipped earnings are paid out monthly via gift cards, 
                making deal-sharing even more rewarding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6">🚀 How It Works</h2>
        
        <div className="space-y-6 pl-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 font-bold">1️⃣</div>
            <div>
              <span className="font-medium">Discover:</span> Browse through handpicked deals, search for what you need, and stumble upon unexpected savings.
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 font-bold">2️⃣</div>
            <div>
              <span className="font-medium">Engage:</span> Vote, comment, and interact with the community to share your shopping expertise.
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 font-bold">3️⃣</div>
            <div>
              <span className="font-medium">Save:</span> Find the best prices, combine discounts, and maximize rewards—all with the help of fellow shoppers.
            </div>
          </div>
        </div>
        
        <p className="mt-8 mb-4">
          KwikDeals isn&apos;t just a deal-sharing platform—it&apos;s a community of smart shoppers helping each other save. 
          Join us today and start winning the savings game!
        </p>
      </section>
      
      <div className="text-center my-12">
        <Link 
          href="/trending-deals" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium text-lg"
        >
          🌟 Start saving now!
        </Link>
      </div>
    </div>
  );
}