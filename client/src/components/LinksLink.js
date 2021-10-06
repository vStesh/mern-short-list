import React from "react";
import {NavLink} from "react-router-dom";

export const LinksLink = ({links}) => {
    if(!links.length) {
        return (
            <p className="center">Ссылок пока нет</p>
        );
    }

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Оригинальная</th>
                    <th>Сокращенная</th>
                    <th>Открыть</th>
                </tr>
                </thead>

                <tbody>
                { links.map((link, index) => {
                    return (
                        <tr key={link._id}>
                            <td>{index + 1}</td>
                            <td>{link.from}</td>
                            <td>{link.to}</td>
                            <td><NavLink to={`/detail/${link._id}`}>Открыть</NavLink></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    );
}