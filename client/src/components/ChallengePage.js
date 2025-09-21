import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ChallengePage.module.css';

import forestBg from '../images/background-forest.gif';
import butterflyIcon from '../icons/butterfly.gif';
import speechBubbleIcon from '../icons/speech-bubble.png';
import homeIcon from '../icons/home.png';
import leaderboardIcon from '../icons/leaderboard.png';
import cheatsheetIcon from '../icons/cheatsheet.png';

function ChallengePage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showWebshell, setShowWebshell] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [terminalUrl, setTerminalUrl] = useState('');
  const [isTerminalLoading, setIsTerminalLoading] = useState(false);
  const [publicApiUrl, setPublicApiUrl] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/challenge/${challengeId}`);
        const data = await response.json();
        if (data.success) {
          setChallenge(data.challenge);
          setPublicApiUrl(data.publicApiUrl);
        } else {
          navigate('/map');
        }
      } catch (error) {
        console.error("Failed to fetch challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId, navigate]);

  const openTerminal = async () => {
    // For Azure Web App terminal, we can directly set the URL
    if (!terminalUrl && !isTerminalLoading) {
      setIsTerminalLoading(true);
      // Simulate a brief loading time for UX
      setTimeout(() => {
        const webshellUrl = process.env.REACT_APP_WEBSHELL_URL || 'https://ctf01.azurewebsites.net';
        setTerminalUrl(webshellUrl);
        setIsTerminalLoading(false);
      }, 1000);
    }
  };

  const closeTerminal = async () => {
    // Simply clear the terminal URL
    setTerminalUrl('');
    setShowWebshell(false);
  };

//   const handleFlagSubmit = async (event) => {
//     event.preventDefault();
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert("You are not logged in!");
//       return navigate('/');
//     }
//     try {
//       const response = await fetch('http://localhost:5000/api/challenge/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           challengeId: challenge.challengeId,
//           flag: flagInput
//         })
//       });
//       const data = await response.json();
//       alert(data.message);
//       if (data.success && data.message !== "Already solved!") {
//         navigate('/map');
//       }
//     } catch (error) {
//       console.error("Error submitting flag:", error);
//       alert("An error occurred.");
//     }
//   };

//   if (isLoading) return <div>Loading Challenge...</div>;
//   if (!challenge) return <div>Challenge not found.</div>;

//   return (
//     <div className={styles.pageContainer} style={{ backgroundImage: `url(${forestBg})` }}>
//       <div className={styles.mainContent}>
//         {/* Challenge Info Box */}
//         <div className={styles.challengeBox}>
//           <h1>{challenge.name}</h1>
//           <div className={styles.header}>
//             <span>{challenge.category}</span>
//             <span>{challenge.difficulty}</span>
//           </div>
//           <p className={styles.description}>{challenge.description}</p>
//           {challenge.downloadFile && (
//             <>
//               <a href={`${publicApiUrl}/files/${challenge.downloadFile}`} download className={styles.downloadLink}>
//                 &lt;&lt;Download {challenge.downloadFile}&gt;&gt;
//               </a>
//               <p>
//                 In webshell, use: <code>curl {publicApiUrl}/files/{challenge.downloadFile} -o {challenge.downloadFile}</code>
//               </p>
//             </>
//           )}
//           <form onSubmit={handleFlagSubmit} className={styles.flagForm}>
//             <input
//               type="text"
//               className={styles.flagInput}
//               value={flagInput}
//               onChange={(e) => setFlagInput(e.target.value)}
//               placeholder="flag{...}"
//             />
//             <button type="submit" className={styles.submitButton}>Submit</button>
//           </form>
//         </div>

//         {/* Hint Area */}
//         <div className={styles.hintArea}>
//           <div
//             className={styles.mascotContainer}
//             onClick={() => setShowHint(!showHint)}
//           >
//             <img
//               src={butterflyIcon}
//               alt="Hint Mascot"
//               className={styles.hintMascot}
//             />
//             <img
//               src={speechBubbleIcon}
//               alt="Show Hint"
//               className={styles.speechBubble}
//             />
//           </div>
//           {showHint && (
//             <div className={styles.hintBox}>
//               <strong>Hint:</strong> This is a placeholder hint. You might want to use a specific tool. Check the cheatsheet!
//             </div>
//           )}
//         </div>

//         {/* Legend */}
//         <div className={styles.legend}>
//           <h3>Legend</h3>
//           <Link to="/map" className={styles.legendItem}>
//             <span className={styles.icon} style={{ backgroundImage: `url(${homeIcon})` }}></span>
//             <span>Home</span>
//           </Link>
//           <a href="/leaderboard" target="_blank" rel="noopener noreferrer" className={styles.legendItem}>
//             <span className={styles.icon} style={{ backgroundImage: `url(${leaderboardIcon})` }}></span>
//             <span>Leaderboard</span>
//           </a>
//           <a href="/cheatsheet" target="_blank" rel="noopener noreferrer" className={styles.legendItem}>
//             <span className={styles.icon} style={{ backgroundImage: `url(${cheatsheetIcon})` }}></span>
//             <span>Cheatsheet</span>
//           </a>
//         </div>
//       </div>

//         {/* Webshell Toggle and Container */}
//         <div className={styles.webshellToggle} onClick={() => setShowWebshell(!showWebshell)}>
//           <span className={styles.toggleText}>
//             {showWebshell ? "Close Webshell" : "Open Webshell"}
//           </span>
//         </div>

//         <div className={`${styles.webshellContainer} ${showWebshell ? styles.visible : ''}`}>
//         <div className={styles.webshellHeader}>
//             <span>Kali Linux Terminal</span>
//             {/* The "X" button now properly closes the session */}
//             <button onClick={closeTerminal}>X</button>
//         </div>
//         <div className={styles.webshellBody}>
//             {isTerminalLoading && <p>Loading Terminal...</p>}
//             {terminalUrl && !isTerminalLoading && (
//             <iframe src={terminalUrl} title="CTF Webshell Terminal"></iframe>
//             )}
//         </div>
//         </div>
//     </div>
//   );
// }

// export default ChallengePage;

// client/src/components/ChallengePage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './ChallengePage.module.css';

import forestBg from '../images/background-forest.gif';
import butterflyIcon from '../icons/butterfly.gif';
import speechBubbleIcon from '../icons/speech-bubble.png';
import homeIcon from '../icons/home.png';
import cheatsheetIcon from '../icons/cheatsheet.png';

function ChallengePage() {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  // Prevent scroll chaining to the page only while panel is open
  useEffect(() => {
    const root = document.documentElement;
    if (showWebshell) {
      root.style.overscrollBehaviorY = 'none';
    } else {
      root.style.overscrollBehaviorY = '';
    }
    return () => {
      root.style.overscrollBehaviorY = '';
    };
  }, [showWebshell]);

  // Clean up terminal when component unmounts
  useEffect(() => {
    return () => {
      // Simple cleanup - just clear the URL
      setTerminalUrl('');
    };
  }, []);

  // Open/close webshell functionality
  const handleTogglePanel = async () => {
    if (!showWebshell) {
      setShowWebshell(true);
      if (!terminalUrl && !isTerminalLoading) {
        await openTerminal();
      }
    } else {
      setShowWebshell(false);
    }
  };

  const handleHardClose = async () => {
    setShowWebshell(false);
    if (terminalUrl) {
      await closeTerminal();
    }
  };

  const handleFlagSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in!');
      return navigate('/');
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenge/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          flag: flagInput,
        }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.success && data.message !== 'Already solved!') {
        navigate('/map');
      }
    } catch (error) {
      console.error('Error submitting flag:', error);
      alert('An error occurred.');
    }
  };

  if (isLoading) return <div>Loading Challenge...</div>;
  if (!challenge) return <div>Challenge not found.</div>;

  return (
    <div className={styles.pageContainer} style={{ backgroundImage: `url(${forestBg})` }}>
      <div className={styles.mainContent}>
        {/* Challenge Info Box */}
        <div className={styles.challengeBox}>
          <h1>{challenge.name}</h1>
          <div className={styles.header}>
            <span>{challenge.category}</span>
            <span>{challenge.difficulty}</span>
          </div>
          <p className={styles.description}>{challenge.description}</p>

          {challenge.downloadFile && (
            <>
              <a 
                href={`${process.env.REACT_APP_API_URL}/files/${challenge.downloadFile}`} 
                download 
                className={styles.downloadLink}
              >
                Download {challenge.downloadFile};
              </a>
            </>
          )}

          <form onSubmit={handleFlagSubmit} className={styles.flagForm}>
            <input
              type="text"
              className={styles.flagInput}
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="flag{...}"
            />
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        </div>

        {/* Hint Area */}
        <div className={styles.hintArea}>
          <div className={styles.mascotContainer} onClick={() => setShowHint(!showHint)}>
            <img src={butterflyIcon} alt="Hint Mascot" className={styles.hintMascot} />
            <img src={speechBubbleIcon} alt="Show Hint" className={styles.speechBubble} />
          </div>
          {showHint && (
            <div className={styles.hintBox}>
              <strong>Hint:</strong> This is a placeholder hint. You might want to use a specific tool.
              Check the cheatsheet!
            </div>
          )}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <h3>Legend</h3>
          <Link to="/map" className={styles.legendItem}>
            <span className={styles.icon} style={{ backgroundImage: `url(${homeIcon})` }} />
            <span>Home</span>
          </Link>
          {/* Leaderboard removed */}
          <a
            href="/cheatsheet"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.legendItem}
          >
            <span
              className={styles.icon}
              style={{ backgroundImage: `url(${cheatsheetIcon})` }}
            />
            <span>Cheatsheet</span>
          </a>
        </div>
      </div>

      {/* Side Toggle Button */}
      <button
        className={`${styles.webshellToggle} ${showWebshell ? styles.webshellToggleShifted : ''}`}
        onClick={handleTogglePanel}
        aria-label={showWebshell ? "Close Webshell" : "Open Webshell"}
        title={showWebshell ? "Close Webshell" : "Open Webshell Terminal"}
      >
        {showWebshell ? "Close Webshell" : "Open Webshell"}
      </button>

      {/* Webshell Panel */}
      <div className={`${styles.webshellContainer} ${showWebshell ? styles.visible : ''}`}>
        <div className={styles.webshellHeader}>
          <span>Kali Linux Webshell</span>
          <button onClick={handleHardClose} className={styles.closeBtn} title="Close">
            X
          </button>
        </div>

        <div className={styles.webshellBody}>
          {isTerminalLoading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#00ff00', fontFamily: 'monospace' }}>
              <h3>� Starting Terminal...</h3>
              <p>Please wait while we prepare your Kali Linux environment...</p>
            </div>
          ) : terminalUrl ? (
            <iframe
              src={terminalUrl}
              title="Kali Linux Terminal"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#000'
              }}
              allow="clipboard-read; clipboard-write"
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#00ff00', fontFamily: 'monospace' }}>
              <h3>🖥️ Kali Linux Terminal</h3>
              <p>Access a full Kali Linux environment with all the tools you need for CTF challenges.</p>
              <p>Available tools: nmap, burpsuite, sqlmap, john, hashcat, and many more!</p>
              <br />
              <button 
                onClick={openTerminal}
                style={{
                  background: '#00ff00',
                  color: '#000',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  borderRadius: '4px'
                }}
              >
                Start Terminal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengePage;



