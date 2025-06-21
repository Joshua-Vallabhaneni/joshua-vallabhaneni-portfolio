"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Send, Loader2, Phone, MessageCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import AnimatedSectionHeader from "./AnimatedSectionHeader"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormData = z.infer<typeof formSchema>

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      console.log(data) // Now 'data' is being used
      // Here you would typically send the form data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setSubmitSuccess(true)
      reset()
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "pjvallabhaneni@gmail.com",
      href: "mailto:pjvallabhaneni@gmail.com",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "College Park, Maryland",
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <section
      id="contact"
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader 
          title="Get in Touch" 
        />
        
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Information */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div className="modern-card p-6">
                <h3 className="text-2xl font-semibold gradient-text mb-6">Let's Connect</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors duration-300"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${info.color} shadow-lg`}>
                            <info.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">{info.label}</div>
                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {info.value}
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${info.color} shadow-lg`}>
                            <info.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">{info.label}</div>
                            <div className="font-medium text-foreground">{info.value}</div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="modern-card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 bg-background/50 backdrop-blur-sm ${
                      errors.name 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-border focus:border-primary focus:ring-primary/20"
                    } focus:outline-none focus:ring-4`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 bg-background/50 backdrop-blur-sm ${
                      errors.email 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-border focus:border-primary focus:ring-primary/20"
                    } focus:outline-none focus:ring-4`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject *
                </label>
                <input
                  {...register("subject")}
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 bg-background/50 backdrop-blur-sm ${
                    errors.subject 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-border focus:border-primary focus:ring-primary/20"
                  } focus:outline-none focus:ring-4`}
                  placeholder="What's this about?"
                />
                {errors.subject && <p className="mt-2 text-sm text-red-500">{errors.subject.message}</p>}
              </div>
              
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 bg-background/50 backdrop-blur-sm resize-none ${
                    errors.message 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-border focus:border-primary focus:ring-primary/20"
                  } focus:outline-none focus:ring-4`}
                  placeholder="Tell me about your project, ideas, or just say hello!"
                ></textarea>
                {errors.message && <p className="mt-2 text-sm text-red-500">{errors.message.message}</p>}
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full modern-button-primary px-8 py-4 text-base font-medium rounded-xl transition-all duration-300 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>
              
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Thanks for reaching out! I'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

