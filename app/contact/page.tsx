export default function ContactPage(){
  return (
    <div className="p-10 text-white space-y-4 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Contact</h1>
      <p className="text-gray-300">Need help or have feedback? Reach out at <a href="mailto:support@example.com" className="text-blue-400 underline">support@example.com</a>.</p>
      <form className="space-y-4 max-w-lg mt-4">
        <input className="w-full px-4 py-2 rounded-md bg-[#161616] border border-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Your email" />
        <textarea rows={4} className="w-full px-4 py-2 rounded-md bg-[#161616] border border-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Message"></textarea>
        <button type="submit" className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold text-white text-sm">Send</button>
      </form>
    </div>
  );
}
