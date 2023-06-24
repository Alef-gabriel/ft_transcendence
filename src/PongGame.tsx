import React, { useEffect, useRef, useState } from 'react';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const paddle1Ref = useRef<HTMLDivElement>(null);
  const paddle2Ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  let x = 150;
  let y = 150;
  let dx = 2;
  let dy = 4;
  let paddle1Y = 40;
  let paddle2Y = 40;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
      const context = canvas.getContext('2d');
      if (context) {
        contextRef.current = context;
        setInterval(draw, 10);
      }
    }
  }, []);

  const draw = () => {
    const context = contextRef.current;
    if (context) {
      context.clearRect(0, 0, 800, 400);
      context.fillStyle = '#000';
      context.fillRect(0, 0, 800, 400);
      context.fillStyle = '#FFF';
      context.fillRect(10, paddle1Y, 10, 60);
      context.fillRect(780, paddle2Y, 10, 60);
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2, false);
      context.closePath();
      context.fill();

      x += dx;
      y += dy;

      if (y + dy > 390 || y + dy < 10) {
        dy = -dy;
      }

      if (x + dx > 790) {
        if (y > paddle2Y && y < paddle2Y + 60) {
          dx = -dx;
        } else {
          setScore1(prevScore => prevScore + 1);
          resetBall();
        }
      }

      if (x + dx < 20) {
        if (y > paddle1Y && y < paddle1Y + 60) {
          dx = -dx;
        } else {
          setScore2(prevScore => prevScore + 1);
          resetBall();
        }
      }
    }
  };

  const resetBall = () => {
    x = 150;
    y = 150;
    dx = 2;
    dy = 4;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const paddle1 = paddle1Ref.current;
    if (canvas && paddle1) {
      const rect = canvas.getBoundingClientRect();
      const mouseY = event.clientY - rect.top;
      paddle1.style.top = `${mouseY - 30}px`;
      paddle1Y = mouseY - 30;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        Player 1 Score: {score1}
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        Player 2 Score: {score2}
      </div>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #FFF', marginTop: 30 }}
        onMouseMove={handleMouseMove}
      />
      <div
        ref={paddle1Ref}
        style={{
          position: 'absolute',
          width: '10px',
          height: '60px',
          backgroundColor: '#FFF',
          left: '10px',
          top: '40px',
        }}
      />
      <div
        ref={paddle2Ref}
        style={{
          position: 'absolute',
          width: '10px',
          height: '60px',
          backgroundColor: '#FFF',
          right: '10px',
          top: `${paddle2Y}px`,
        }}
      />
    </div>
  );
};

export default PongGame;