export default function HowItWorks() {
  return (
    <div className="mt-16 bg-neutral-850/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-primary-900/30 p-8">
      <h2 className="font-heading text-2xl mb-6 text-white">
        How Certificate Verification Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-neutral-750/50 p-6 rounded-lg border border-white/5 hover:border-primary-500/30 transition-colors">
          <div className="bg-primary-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span className="text-xl font-bold text-primary-400">1</span>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Enter Details</h3>
          <p className="text-gray-400">
            Input the certificate hash and recipient address provided with the
            certificate.
          </p>
        </div>

        <div className="bg-neutral-750/50 p-6 rounded-lg border border-white/5 hover:border-primary-500/30 transition-colors">
          <div className="bg-primary-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span className="text-xl font-bold text-primary-400">2</span>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Blockchain Verification
          </h3>
          <p className="text-gray-400">
            Our system checks the blockchain to confirm the certificate's
            authenticity.
          </p>
        </div>

        <div className="bg-neutral-750/50 p-6 rounded-lg border border-white/5 hover:border-primary-500/30 transition-colors">
          <div className="bg-primary-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span className="text-xl font-bold text-primary-400">3</span>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">View Results</h3>
          <p className="text-gray-400">
            View the certificate details and access the original document if
            verified.
          </p>
        </div>
      </div>
    </div>
  );
}
