import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p>
                Welcome to AgriShare. We respect your privacy and are committed to protecting your personal data.
                This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect the following types of information:</p>

              <h3 className="font-semibold text-lg mb-2">Personal Information:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Location information</li>
                <li>Account credentials</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2">Equipment Information:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Equipment descriptions and specifications</li>
                <li>Photos and pricing information</li>
                <li>Availability and location data</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2">Usage Data:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Booking history and transaction details</li>
                <li>Messages and communications on the platform</li>
                <li>Reviews and ratings</li>
                <li>Platform usage patterns and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="mb-2">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our platform services</li>
                <li>Process bookings and facilitate transactions</li>
                <li>Enable communication between owners and renters</li>
                <li>Send important updates and notifications</li>
                <li>Improve our services and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Information Sharing</h2>
              <p className="mb-2">We share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>With Other Users:</strong> Your name, location, and contact information are visible to users you interact with for bookings</li>
                <li><strong>Service Providers:</strong> We may share data with trusted third-party services that help us operate the platform</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, your data may be transferred</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
                the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and review your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain data processing</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze platform usage,
                and deliver personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Data Retention</h2>
              <p>
                We retain your personal data for as long as necessary to provide our services and comply with legal
                obligations. When you delete your account, we will remove or anonymize your personal information
                within a reasonable timeframe, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p>
                Our platform is not intended for users under 18 years of age. We do not knowingly collect personal
                information from children. If you believe a child has provided us with personal data, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of significant changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
              <p>
                If you have questions or concerns about this privacy policy or our data practices, please contact
                us through our platform support system.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/auth/signup">
              <Button variant="outline">Back to Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
