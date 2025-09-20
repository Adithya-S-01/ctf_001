// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import styles from './ChallengePage.module.css';

// import forestBg from '../images/background-forest.gif';
// import butterflyIcon from '../icons/butterfly.gif';
// import speechBubbleIcon from '../icons/speech-bubble.png';
// import homeIcon from '../icons/home.png';
// import leaderboardIcon from '../icons/leaderboard.png';
// import cheatsheetIcon from '../icons/cheatsheet.png';


// function ChallengePage() {
//   const { challengeId } = useParams();
//   const navigate = useNavigate();

//   const [challenge, setChallenge] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showHint, setShowHint] = useState(false);
//   const [showWebshell, setShowWebshell] = useState(false);
//   const [flagInput, setFlagInput] = useState('');
//   const [terminalUrl, setTerminalUrl] = useState('');
//   const [isTerminalLoading, setIsTerminalLoading] = useState(false);
//   const [publicApiUrl, setPublicApiUrl] = useState('');

//   useEffect(() => {
//     const fetchChallenge = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`http://localhost:5000/api/challenge/${challengeId}`);
//         const data = await response.json();
//         if (data.success) {
//           setChallenge(data.challenge);
//           setPublicApiUrl(data.publicApiUrl);
//         } else {
//           navigate('/map');
//         }
//       } catch (error) {
//         console.error("Failed to fetch challenge:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchChallenge();
//   }, [challengeId, navigate]);

//     const openTerminal = async () => {
//     // Don't do anything if a terminal is already loading or loaded
//     if (terminalUrl || isTerminalLoading) return;

//     setIsTerminalLoading(true);
//     const token = localStorage.getItem('token');
//     try {
//         const response = await fetch('http://localhost:5000/api/webshell/start', {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await response.json();

//         if (data.url) {
//         setTerminalUrl(data.url); // Set the URL for the iframe
//         } else {
//         console.error("Failed to get terminal URL:", data.error);
//         }
//     } catch (err) {
//         console.error("Error fetching terminal:", err);
//     } finally {
//         setIsTerminalLoading(false);
//     }
//     };

//     const closeTerminal = async () => {
//     if (!terminalUrl) return; // No terminal to close

//     const token = localStorage.getItem('token');
//     try {
//         await fetch('http://localhost:5000/api/webshell/stop', {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` }
//         });
//     } catch (err) {
//         console.error("Error stopping terminal:", err);
//     } finally {
//         // Clear the URL regardless of success
//         setTerminalUrl('');
//         setShowWebshell(false); // Also close the panel
//     }
//     };

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
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  // Webshell state (temporarily disabled)
  const [showWebshell, setShowWebshell] = useState(false);
  // const [terminalUrl, setTerminalUrl] = useState('');
  // const [isTerminalLoading, setIsTerminalLoading] = useState(false);

  // Other
  const [flagInput, setFlagInput] = useState('');
  // Note: publicApiUrl temporarily disabled while webshell service is separate
  // const [publicApiUrl, setPublicApiUrl] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenge/${challengeId}`);
        const data = await response.json();
        if (data.success) {
          setChallenge(data.challenge);
          // setPublicApiUrl(data.publicApiUrl); // Temporarily disabled
        } else {
          navigate('/map');
        }
      } catch (error) {
        console.error('Failed to fetch challenge:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId, navigate]);

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

  // Webshell functions temporarily disabled
  // const openTerminal = useCallback(async () => {
  //   alert('Webshell service will be available after Docker services are deployed to Azure');
  // }, []);

  // const stopTerminal = useCallback(async () => {
  //   alert('Webshell service will be available after Docker services are deployed to Azure');
  // }, []);

  // Stop container when leaving the page - temporarily disabled
  // useEffect(() => {
  //   return () => {
  //     stopTerminal().catch(() => {});
  //   };
  // }, [stopTerminal]);

  // Open/close PANEL only (temporarily disabled)
  const handleTogglePanel = async () => {
    alert('Webshell service will be available after Docker services are deployed to Azure');
  };

  const handleHardClose = async () => {
    setShowWebshell(false);
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
        aria-label="Webshell (temporarily disabled)"
        title="Webshell service will be available after Azure deployment"
      >
        Open Webshell (Coming Soon)
      </button>

      {/* Webshell Panel - Temporarily Disabled */}
      <div className={`${styles.webshellContainer} ${showWebshell ? styles.visible : ''}`}>
        <div className={styles.webshellHeader}>
          <span>Webshell Service (Coming Soon)</span>
          <button onClick={handleHardClose} className={styles.closeBtn} title="Close">
            X
          </button>
        </div>

        <div className={styles.webshellBody}>
          <div style={{ padding: '20px', textAlign: 'center', color: '#00ff00', fontFamily: 'monospace' }}>
            <h3>🚧 Webshell Service Under Development 🚧</h3>
            <p>The webshell terminal will be available after Docker services are deployed to Azure.</p>
            <p>This will provide you with a full Kali Linux environment for solving challenges.</p>
            <br />
            <p>For now, you can download challenge files and work on them locally.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengePage;



