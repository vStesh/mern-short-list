import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom";


export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [link, setLink] = useState('');

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    // const pressHandler = async event => {
    //     if(event.key === 'Enter') {
    //         try {
    //             const data = await request('/api/link/generate', 'POST', {from: link}, {
    //                 Authorization: `Bearer ${auth.token}`
    //             });
    //             history.push(`/detail/${data.link._id}`);
    //             console.log(data);
    //         } catch (e) {}
    //     }
    // }

    const pressHandler = async () => {
        try {
            const data = await request('/api/link/generate', 'POST', {from: link}, {
                Authorization: `Bearer ${auth.token}`
            });
            history.push(`/detail/${data._id}`);
            console.log(data);
        } catch (e) {}
    }

    return (
        <div className="row col12">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <input
                    className="col s9"
                    placeholder="Вставьте ссылку"
                    id="link"
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    // onKeyPress={pressHandler}
                />
                <a className="col s2 offset-s1 waves-effect waves-light btn-large" onClick={pressHandler}>Добавить</a>
                <label htmlFor="link">Введите ссылку</label>
            </div>

        </div>
    );
}