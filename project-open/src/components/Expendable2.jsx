import { useState } from 'react';
import Linkify from 'react-linkify';


const Expandable2 = ({children, maxChars=170}) => {
    let [expanded, setExpanded] = useState(true)

    if(children.length <= maxChars) return <p>{children}</p>

    let text = expanded ? children.substring(0, maxChars) : children

    return (
        <>
        <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
        <a href={decoratedHref} key={key} target="_blank">
            {decoratedText}
        </a>
        )}>
            <p className="Expendable">
                {text}
                <span className="col-3" onClick={()=> setExpanded(!expanded)}>{expanded? "...Leia mais":" Leia menos"}</span>
            </p>
        </Linkify>
        </>
    )
}

export default Expandable2;