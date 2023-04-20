import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPaperPlane, faMessage, faGear, faX } from '@fortawesome/free-solid-svg-icons';
import ReactModal from "react-modal";

ReactModal.setAppElement('#root');


const App = () => {
    const [ value, setValue ] = useState(null);
    const [ message, setMessage ] = useState(null);
    const [ previousChats, setPreviousChats ] = useState([]);
    const [ currentTitle, setCurrentTitle ] = useState(null);
    const [ modalIsOpen, setIsOpen ] = React.useState(false);

    const createNewChat = () => {
        setMessage(null);
        setValue('');
        setCurrentTitle(null);
    }

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    
    const Button = () => {
        return <div role="button" className="modal-close" abIndex={0} onClick={closeModal}><FontAwesomeIcon icon={faX} /></div>
    }

function LightModeButton() {
  const [isLightMode, setIsLightMode] = useState(false);
  const body = document.body;

  function handleClick() {
    setIsLightMode(!isLightMode);
    body.classList.toggle("light-mode");
  }

  return (
    <button
      className={`light-mode-btn ${isLightMode ? "light-mode" : ""}`}
      onClick={handleClick}
    >
      {isLightMode ? "Dark" : "Light"}
    </button>
  );
}
    

    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle)
        setMessage(null);
        setValue('');
    }

    const getMessages = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const response = await fetch('http://localhost:8000/completions', options);
            const data = await response.json();
            setMessage(data.choices[0].message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(!currentTitle && value && message) {
            setCurrentTitle(value);
        }
        if(currentTitle && value && message) {
            setPreviousChats(prevChats => (
                [...prevChats, 
                    {
                        title: currentTitle,
                        role: "user",
                        content: value
                    }, 
                    {
                        title: currentTitle,
                        role: message.role,
                        content: message.content
                    }
                ]
            ))
        }
    }, [message, currentTitle]);

    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle);
    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)));
    return (
        <div className="app">
            <section className="side-bar">
                <button onClick={(createNewChat)}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> New chat</button>
                <ul className="history">
                    {uniqueTitles?.map((uniqueTitle, index) => <li className="btn" key={index} onClick={() => handleClick(uniqueTitle)}><FontAwesomeIcon className="message" icon={faMessage} />{uniqueTitle}</li>)}
                </ul>
                <nav>
                   
                    <button className="nav-item" onClick={openModal}>
                        <ReactModal className="modal" overlayClassName="modal-overlay" isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Modal de exemplo">
                            <div className="modal-body">
                                <h3 className="modal-title">Settings</h3>
                                <Button></Button>
                            </div>
                            <div className="modal-body">
                            <p className="modal-text">Theme</p>
                            <LightModeButton />
                            </div>
                           
                        </ReactModal>
                        <FontAwesomeIcon className="gear" icon={faGear} />
                        Settings
                    </button>
                </nav>
                <footer>
                    <p>Made by Higor</p>
                </footer>
                
            </section>
            <section className="main">
                {!currentTitle && <h1>HigorGPT</h1>}
                <ul className="feed">
                    {currentChat?.map((chatMessage, index) => <li key={index}>
                        <p className="role">{chatMessage.role}</p>
                        <p>{chatMessage.content}</p>
                    </li>)}
                </ul>
                <div className="bottom-section">
                    <div className="input-container">
                        <input value={value} onChange={(e) => setValue(e.target.value)}  placeholder="Send a message..."/>
                        <div disabled id="submit" onClick={getMessages}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        </div>
                    </div>
                    <p className="info">
                        ChatGPT Mar 23 Version. Free Research Preview. ChatGPT
                        may produce inaccurate information about people, places,
                        or facts.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default App;
