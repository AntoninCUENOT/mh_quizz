import React from 'react';

const Response = ({ responseMessages }) => {
    return (
        <>
        <div className='reponse'>
            <p className='high-array'><span>LOGO</span></p>
            <p className='high-array'><span>MONSTRE</span></p>
            <p className='high-array'><span>ESPECE</span></p>
            <p className='high-array'><span>COULEUR</span></p>
            <p className='high-array'><span>MAP 1</span></p>
            <p className='high-array'><span>MAP 2</span></p>
            <p className='high-array'><span>MAP 3</span></p>
            <p className='high-array'><span>TAILLE MIN</span></p>
            <p className='high-array'><span>TAILLE MAX</span></p>
        </div>
        <div className="all-responses">
            {responseMessages.map((response, index) => (
                <div key={index} className={`result ${response.all_correct ? 'correct' : 'incorrect'}`}>
                    {response.all_correct && (
                        <div className='correct-monster'>
                            <h2 className='bravo'>BRAVO!!!<br />
                                <img src={response.user_monster.image_path.value} alt={response.user_monster.name.value} /><br></br>{response.user_monster.name.value}<br></br>
                                {response.user_monster.description.value}
                            </h2>
                        </div>
                    )}
                    <div className='reponse'>
                        <img src={response.user_monster.image_path.value} alt={response.user_monster.name.value} />
                        <p className={response.user_monster.name.class}><span>{response.user_monster.name.value}</span></p>
                        <p className={response.user_monster.type.class}><span>{response.user_monster.type.value}</span></p>
                        <p className={response.user_monster.color.class}><span>{response.user_monster.color.value}</span></p>
                        {response.user_monster.maps.slice(0, 3).map((map, idx) => (
                            <p key={idx} className={map.class}><span>{map.value}</span></p>
                        ))}
                        <p className={response.user_monster.size_min.class}>
                            <span className='arrow'>{response.user_monster.size_min.arrow}</span><span>{response.user_monster.size_min.value}<br></br>Cm</span><span className='arrow'>{response.user_monster.size_min.arrow}</span>
                        </p>
                        <p className={response.user_monster.size_max.class}>
                            <span className='arrow'>{response.user_monster.size_max.arrow}</span><span>{response.user_monster.size_max.value}<br></br>cm</span><span className='arrow'>{response.user_monster.size_max.arrow}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
};

export default Response;
