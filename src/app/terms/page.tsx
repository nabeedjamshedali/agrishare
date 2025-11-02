import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AgriShare ("the Platform"), you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p>
                AgriShare is an online platform that connects agricultural equipment owners with renters.
                We facilitate the listing, discovery, and booking of agricultural machinery and equipment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use this platform</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
                <li>Equipment owners must ensure their machinery is in safe working condition</li>
                <li>Renters must use equipment responsibly and return it in the same condition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Equipment Listings</h2>
              <p>Equipment owners agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Provide accurate descriptions and photos of equipment</li>
                <li>Set fair and reasonable rental rates</li>
                <li>Maintain equipment in safe, working condition</li>
                <li>Respond promptly to booking requests</li>
                <li>Honor confirmed bookings unless emergency circumstances arise</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Bookings and Payments</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All bookings are subject to owner approval</li>
                <li>Prices are set by equipment owners</li>
                <li>Cancellation policies are determined by individual owners</li>
                <li>Payment terms and methods will be coordinated between owners and renters</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Liability and Insurance</h2>
              <p>
                AgriShare acts as a platform to connect users and is not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Equipment condition, safety, or functionality</li>
                <li>Damages or injuries resulting from equipment use</li>
                <li>Disputes between owners and renters</li>
                <li>Loss or theft of equipment</li>
              </ul>
              <p className="mt-3">
                Users are strongly encouraged to maintain appropriate insurance coverage for their equipment and activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Prohibited Activities</h2>
              <p>Users must not:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Post false or misleading information</li>
                <li>Engage in fraudulent activities</li>
                <li>Use the platform for illegal purposes</li>
                <li>Harass or abuse other users</li>
                <li>Attempt to circumvent platform fees or policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Termination</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms or engage in
                suspicious or harmful activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of the platform after changes
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Contact Information</h2>
              <p>
                For questions about these terms, please contact us through our platform support system.
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
