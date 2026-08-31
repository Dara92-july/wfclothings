import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react'

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mb-4">OUR STORY</h1>
        <div className="w-16 h-1 bg-primary-500 mx-auto mb-6 rounded-full" />
        <p className="text-lg text-slate-500 leading-relaxed">
          Way Forward is a Lagos-based streetwear brand built for those who refuse to stand still.
          Born from the belief that what you wear should reflect how you move through the world&mdash;with intent, confidence, and no backward steps.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Made in Lagos</h2>
          <p className="text-slate-500 leading-relaxed mb-4">
            Every piece is designed and produced in Lagos, Nigeria. We work closely with local manufacturers
            to create premium streetwear that stands up to the energy of the city.
          </p>
          <p className="text-slate-500 leading-relaxed">
            From the bustling markets of Balogun to the creative hubs of VI, Lagos is our heartbeat.
            We draw inspiration from the streets, the music, the art, and the people who make this city unstoppable.
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Quality First', desc: 'Premium materials built to last' },
              { icon: Truck, title: 'Free Delivery', desc: 'On orders over ₦50,000' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
              { icon: ArrowRight, title: 'Forward Thinking', desc: 'Designs that push boundaries' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-0.5">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Join the Movement</h2>
        <p className="text-slate-500 mb-6 max-w-lg mx-auto">No backward steps. Only forward moves. Be part of a community that&rsquo;s always pushing ahead.</p>
        <Link to="/register" className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
          Become a Member <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

export default About
