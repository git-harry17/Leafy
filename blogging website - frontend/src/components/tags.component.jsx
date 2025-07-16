import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag=({tag,tagindex})=>{
    let {blog,blog:{tags},setBlog}=useContext(EditorContext);
    const handletagdelete = ()=>{
        tags=tags.filter(t=>t != tag);
        setBlog({...blog,tags})
    }
    const addeditable=(e)=>{
        e.target.setAttribute("contentEditable",true);
        e.target.focus();
    }

    const handletagedit=(e)=>{
        if(e.keyCode==13 || e.keyCode==188)
        {
            e.preventDefault();
            let currentTag =e.target.innerText;
            tags[tagindex] = currentTag;

            setBlog({...blog,tags});

            e.target.setAttribute("contentEditable",false);
            console.log(tags);

        }
    }
    return(
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10 ">

            <p className="outline-none"
            onKeyDown={handletagedit}
            onClick={addeditable}>{tag}</p>

            <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
            onClick={handletagdelete}
            >
               <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    );
}
export default Tag;