import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa"

function Footer(){

return(

<footer className="bg-black text-white pt-20 pb-10 border-t border-gray-800">

<div className="max-w-7xl mx-auto px-10 grid md:grid-cols-3 gap-10">

{/* LEFT SECTION */}

<div>

<h2 className="text-3xl font-bold text-yellow-400 mb-4">
HackOrbit
</h2>

<p className="text-gray-400 leading-relaxed">
Master coding interviews with our comprehensive platform.
Practice DSA problems, take AI-powered mock interviews,
and track your coding progress.
</p>

</div>


{/* CONTACT */}

<div>

<h3 className="text-lg font-semibold mb-5">
Contact
</h3>

<p className="text-gray-400 mb-2">
📧 shivamkumartek123@gmail.com
</p>

<p className="text-gray-400 mb-2">
📞 +91 9955950777
</p>

<p className="text-gray-400">
📍 India
</p>

</div>


{/* FEEDBACK */}

<div>

<h3 className="text-lg font-semibold mb-5">
Feedback
</h3>

<p className="text-gray-400 mb-6">
Help us improve by sharing your thoughts and suggestions.
</p>

<button className="px-6 py-2 border border-gray-600 rounded-lg hover:border-yellow-400 transition">
Send Feedback
</button>

</div>

</div>


{/* SOCIAL ICONS */}

<div className="flex justify-center gap-8 text-xl text-gray-400 mt-16">

<a
href="https://github.com/shivamkumar0502"
target="_blank"
rel="noopener noreferrer"
className="hover:text-white"
>
<FaGithub className="cursor-pointer"/>
</a>

<a
href="https://www.linkedin.com/in/shivam-kumar-b8320437b/"
target="_blank"
rel="noopener noreferrer"
className="hover:text-white"
>
<FaLinkedin className="cursor-pointer"/>
</a>

<a
href="https://instagram.com/"
target="_blank"
rel="noopener noreferrer"
className="hover:text-white"
>
<FaInstagram className="cursor-pointer"/>
</a>

<a
href="https://x.com/ShivamKuma22578"
target="_blank"
rel="noopener noreferrer"
className="hover:text-white"
>
<FaTwitter className="cursor-pointer"/>
</a>

</div>


{/* COPYRIGHT */}

<div className="text-center text-gray-500 mt-8">
© 2026 Codexa. All rights reserved.
</div>

</footer>

)

}

export default Footer