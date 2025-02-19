import "../styles/main.sass";
import "../styles/styles.sass";
import "../styles/pages/ChatLive.sass"
import { Loading } from "./loading";

import styled from "styled-components";

import CommentChat from "./CommentChat";
import { useTranslation } from 'react-i18next';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const Container = styled.div`
  display: flex;
  flex-direction: column 
`;

const ChatLive = () => {
  const [charCount, setCharCount] = useState(0);
  const charLimit = 190;

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 1000)
  })

  return (
    <aside id="ChatLive">
      <Container>
          <Loading/>

          {loading && (
            <div className="Main">
              <div className="Header">
                <span>{t('Chat')}</span>
              </div>

              <div className="ChatComments">
                <div id="CommentLive">
                  <CommentChat/>
                </div>

                <div id="CommentLive">
                  <CommentChat/>
                </div>

                <div id="CommentLive">
                  <CommentChat/>
                </div>

              </div>

                <div className="NewComment">
                    <div>
                      <form action="">
                        <input placeholder={t('Adicione um comentário...')} 
                          maxLength={charLimit}
                          onChange={
                            (e) => setCharCount(e.target.value.length)
                          }
                          required 
                        />
                        <button type='submit' className="col-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                          </svg>
                        </button>

                        <div className="col-3"><Loader2 className="mr-2 size-8 animate-spin" /></div>
                      </form>
                      <span className="countText">{charCount}/{charLimit}</span>
                    </div>
                    
                    <span className="countText">{t('msgBlockedChat')}</span>
                    <span className="countText">{t('msgLoginChat')}</span>
                </div>
            </div>
          )}
      </Container>
    </aside>
  );
}

export default ChatLive;
