import { useState } from 'react';
import Linkify from 'linkify-react';
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";

const Expandable = ({children, maxChars=200}) => {
    let [expanded, setExpanded] = useState(true)

    if(children.length <= maxChars) return <p>{children}</p>

    let text = expanded ? children.substring(0, maxChars) : children

    const optionsLink = {
        formatHref: {
            hashtag: (href) => "/search/posts?q=%23" + href.substr(1),
            mention: (href) => "/" + href.substr(1)
        },
    };
    
    return (
        <>
        <Linkify options={optionsLink} componentDecorator={(decoratedHref, decoratedText, key) => (
        <a href={decoratedHref} key={key} target="_blank">
            {decoratedText}
        </a>
        )}>
            <p className="Expendable col-1">
                {text}
                <span onClick={()=> setExpanded(!expanded)}>{expanded? "...Leia mais":""}</span>
            </p>
        </Linkify>
        </>
    )
}

export default Expandable;