"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Code, Brain, BarChart3, ArrowRight } from "lucide-react";

const FeatureCards = () => {
  // Deterministic pseudo-random height generator (to avoid SSR/CSR mismatch)
  const barHeight = (cardIndex: number, barIndex: number) => 10 + ((cardIndex * 13 + barIndex * 7) % 20);

  const features = [
    {
      icon: Mic,
      title: "AI Voice Interviews",
      description:
        "Practice with realistic AI interviewers across multiple roles and difficulty levels",
      href: "/interview",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      icon: Code,
      title: "Coding Challenges",
      description: "Solve problems with real-time code execution and AI feedback",
      href: "/training/challenges",
      gradient: "from-green-500/20 to-blue-500/20",
    },
    {
      icon: Brain,
      title: "Aptitude Assessment",
      description: "Test quantitative, logical reasoning, and verbal abilities",
      href: "/aptitude",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Detailed analytics and improvement recommendations",
      href: "/analytics",
      gradient: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Ace Your Interview</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive preparation tools powered by advanced AI to help you succeed
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 card-hover p-8 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` as any }}
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform transition-transform">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Action Button */}
                <Link href={feature.href}>
                  <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-primary hover:text-primary/80">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </div>

              {/* Hover Effect Elements */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {feature.icon === Mic && (
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full animate-pulse"
                        style={{ height: `${barHeight(index, i)}px`, animationDelay: `${i * 0.1}s` } as any}
                      />
                    ))}
                  </div>
                )}
                {feature.icon === Code && (
                  <div className="text-xs font-mono text-primary/60">
                    <div>function solve() {'{}'}</div>
                    <div className="animate-pulse">{'>'} running...</div>
                  </div>
                )}
                {feature.icon === Brain && (
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` } as any} />
                    ))}
                  </div>
                )}
                {feature.icon === BarChart3 && (
                  <div className="flex items-end space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-2 bg-primary rounded-t animate-pulse" style={{ height: `${(i + 1) * 4}px`, animationDelay: `${i * 0.1}s` } as any} />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
