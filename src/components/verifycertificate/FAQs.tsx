export default function FAQs() {
  return (
    <div className="mt-16">
      <h2 className="font-heading text-2xl mb-8 text-white text-center">
        FAQs
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-neutral-850/80 backdrop-blur-sm p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-medium text-white mb-2 flex items-center">
            <span className="text-secondary-500 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            What if my certificate doesn't verify?
          </h3>
          <p className="text-gray-400">
            If your certificate doesn't verify, it may be due to an incorrect
            hash or address. Double-check your inputs and try again. If problems
            persist, contact the issuer of your certificate.
          </p>
        </div>

        <div className="bg-neutral-850/80 backdrop-blur-sm p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-medium text-white mb-2 flex items-center">
            <span className="text-secondary-500 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Is my certificate data secure?
          </h3>
          <p className="text-gray-400">
            Yes, we use blockchain technology which means your certificate data
            cannot be altered once issued. Only the hash of your certificate is
            stored on the blockchain, not the actual content.
          </p>
        </div>

        <div className="bg-neutral-850/80 backdrop-blur-sm p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-medium text-white mb-2 flex items-center">
            <span className="text-secondary-500 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            How long does verification take?
          </h3>
          <p className="text-gray-400">
            Verification typically takes just a few seconds. The process
            involves querying the blockchain for the certificate hash and
            recipient address combination.
          </p>
        </div>

        <div className="bg-neutral-850/80 backdrop-blur-sm p-6 rounded-xl border border-white/5">
          <h3 className="text-lg font-medium text-white mb-2 flex items-center">
            <span className="text-secondary-500 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Can I verify certificates offline?
          </h3>
          <p className="text-gray-400">
            Certificate verification requires blockchain access, so an internet
            connection is necessary. The verification process itself is designed
            to be fast and lightweight.
          </p>
        </div>
      </div>
    </div>
  );
}
