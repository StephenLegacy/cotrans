import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Briefcase, Phone, Mail, ArrowLeft, Target, Award } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Game timer
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  // Spawn targets
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        addTarget();
      }, 800);
      return () => clearInterval(interval);
    }
  }, [gameActive]);

  const addTarget = () => {
    const id = Date.now();
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 60 + 10;
    
    setTargets(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  const hitTarget = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setScore(score + 10);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(15);
    setTargets([]);
  };

  const endGame = () => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
    }
    setTargets([]);
  };

  const quickLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Briefcase, label: "Browse Jobs", path: "/jobs" },
    { icon: Phone, label: "Contact Us", path: "/contact" },
    { icon: Mail, label: "About Us", path: "/about" }
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 geometric-pattern opacity-10" />
      <div className="absolute top-20 left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Game targets */}
      {gameActive && targets.map(target => (
        <button
          key={target.id}
          onClick={() => hitTarget(target.id)}
          className="absolute w-12 h-12 bg-secondary rounded-full cursor-crosshair hover:scale-125 transition-transform shadow-lg shadow-secondary/50 flex items-center justify-center"
          style={{ 
            left: `${target.x}%`, 
            top: `${target.y}%`,
            animation: 'ping-once 2s ease-out'
          }}
        >
          <Target className="w-6 h-6 text-primary-foreground" />
        </button>
      ))}

      <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* 404 Header */}
        <div className="mb-8" style={{ animation: 'bounce-slow 3s ease-in-out infinite' }}>
          <h1 className="text-9xl font-display font-bold text-primary-foreground mb-2 drop-shadow-2xl">
            404
          </h1>
          <div className="h-2 w-32 mx-auto bg-secondary rounded-full" />
        </div>

        {/* Message */}
        <div className="bg-primary-foreground/10 backdrop-blur-md rounded-3xl p-8 border border-primary-foreground/20 mb-8 shadow-2xl">
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
            Oops! This Page Took a Vacation
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-6">
            Looks like this page doesn't exist or has been moved. While you're here, why not play a quick game?
          </p>

          {/* Game Section */}
          <div className="bg-primary-foreground/5 rounded-2xl p-6 mb-6 border border-primary-foreground/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="text-primary-foreground/60 text-sm">Score</p>
                  <p className="text-3xl font-bold text-secondary">{score}</p>
                </div>
                {highScore > 0 && (
                  <div className="text-left">
                    <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
                      <Award className="w-4 h-4" /> Best
                    </p>
                    <p className="text-2xl font-bold text-primary-foreground">{highScore}</p>
                  </div>
                )}
              </div>
              {gameActive && (
                <div className="text-right">
                  <p className="text-primary-foreground/60 text-sm">Time Left</p>
                  <p className="text-3xl font-bold text-primary-foreground">{timeLeft}s</p>
                </div>
              )}
            </div>

            {!gameActive ? (
              <button
                onClick={startGame}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🎯 Start Target Practice Game
              </button>
            ) : (
              <div className="text-primary-foreground/70 text-sm">
                Click the targets as fast as you can! ⚡
              </div>
            )}
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group bg-primary-foreground/5 hover:bg-primary-foreground/10 border border-primary-foreground/10 hover:border-secondary/50 rounded-xl p-4 transition-all hover:scale-105 hover:shadow-lg"
              >
                <link.icon className="w-8 h-8 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-primary-foreground text-sm font-medium">{link.label}</p>
              </Link>
            ))}
          </div>

          {/* Main CTA */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Home
          </Link>
        </div>

        {/* Footer message */}
        <p className="text-primary-foreground/60 text-sm">
          Looking for a job in UAE? We're here to help you find the perfect opportunity.
        </p>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes ping-once {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        .cursor-crosshair {
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
};

export default NotFound;