import './App.css';
import app from './configuration';
import { getDatabase, ref, push, set, onValue, get } from "firebase/database";
import { useEffect, useState } from 'react';
import AdsComponent from './AdsComponent';

const App = () => {
  const [currentPoem, setCurrentPoem] = useState(null);
  const [currentPoemKey, setCurrentPoemKey] = useState(null);
  const [newSubNodeText, setNewSubNodeText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = () => {
    const db = getDatabase(app);
    const collectionRef = ref(db, "poems");

    onValue(collectionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const poemKeys = Object.keys(data);
        const randomIndex = Math.floor(Math.random() * poemKeys.length);
        const chosenKey = poemKeys[randomIndex];
        const chosenPoem = data[chosenKey];

        setCurrentPoem(chosenPoem);
        setCurrentPoemKey(chosenKey);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const checkForEmptyPoems = async () => {
    const db = getDatabase(app);
    const collectionRef = ref(db, "poems");
    const snapshot = await get(collectionRef);
    if (snapshot.exists()) {
      const poems = snapshot.val();
      return Object.values(poems).some(poem => 
        poem && poem.content === "" && Object.keys(poem).length === 1
      );
    }
    return false;
  };

  const createNewPoem = async () => {
    setErrorMessage('');
    const hasEmptyPoem = await checkForEmptyPoems();
    if (hasEmptyPoem) {
      alert("there's already an empty poem, refresh the page if you'd like a new one.");
      return;
    }

    const db = getDatabase(app);
    const collectionRef = ref(db, "poems");
    const newPoemRef = push(collectionRef);

    set(newPoemRef, { content: "" })
      .then(() => {
        console.log('New poem created!');
        setCurrentPoem({ content: "" });
        setCurrentPoemKey(newPoemRef.key);
      })
      .catch((error) => {
        console.error('Error creating new poem:', error);
      });
  };

  const containsProfanity = (text) => {
    const profanityList = ["fuck", "shit", "bitch", "cunt", "whore", "ass"]; 
    const words = text.toLowerCase().split(" ");
    return words.some(word => profanityList.includes(word));
  };

  const handleSubmitSubNode = () => {
    if (!newSubNodeText.trim()) {
      alert("enter conent, not empty lines.");
      return;
    }

    if (containsProfanity(newSubNodeText)) {
      alert("please do not include inappropriate language in your line.");
      return;
    }

    if (!currentPoemKey) return;

    const db = getDatabase(app);
    const poemRef = ref(db, `poems/${currentPoemKey}`);
    const newLineKey = push(poemRef).key;

    set(poemRef, {
      ...currentPoem,
      [newLineKey]: newSubNodeText
    })
      .then(() => {
        console.log('Subnode added!');
        setNewSubNodeText('');
        setCurrentPoem((prevPoem) => ({
          ...prevPoem,
          [newLineKey]: newSubNodeText,
        }));
      })
      .catch((error) => {
        console.error('Error adding subnode:', error);
      });
  };

  return (
    <div className="App">
      <div className='leftColumn'>
        <AdsComponent dataAdSlot='2045138080' />
      </div>
      <div className='body'>
        <h1 className="title">poetry is not a solitary art.</h1>
        <br />
        <div className="options">
          <button id="skip" onClick={createNewPoem}>🔃</button>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {currentPoem && (
          <div className='poem'>
            <div className='inputfield'>
              <input
                id="input"
                type="text"
                value={newSubNodeText}
                onChange={(e) => setNewSubNodeText(e.target.value)}
                placeholder="add your line"
              />
              <button id="submitButton" onClick={handleSubmitSubNode}>✔️</button>
            </div>

            {Object.keys(currentPoem).filter(key => key !== 'key').map(lineKey => (
              <p key={lineKey}>{currentPoem[lineKey]}</p>
            ))}
          </div>
        )}
      </div>
      <div className='rightColumn'>
        <AdsComponent dataAdSlot='5654605832' />
      </div>
    </div>
  );
};

export default App;
