"use client"

import { motion } from "framer-motion"
import { Construction, ArrowLeft, Clock, Wrench, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function UnderDevelopmentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <Construction className="h-24 w-24 text-blue-500" />
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Under Development
              </h1>
              <p className="text-xl text-muted-foreground">
                We&apos;re working hard to bring you something amazing!
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8"
            >
              <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Clock className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Coming Soon
                </p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-teal-50 dark:bg-teal-950/20">
                <Wrench className="h-8 w-8 text-teal-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  In Progress
                </p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Sparkles className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stay Tuned
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-md"
            >
              <p className="text-muted-foreground">
                This feature is currently under development. Our team is working diligently to
                deliver a seamless experience. Please check back later or explore our other features.
              </p>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="w-full max-w-md"
            >
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-teal-500"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Development in progress...
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
