import React, {useState, useEffect} from "react";
import { Container, Owner, Loading, BackButton, IssuesList } from "./styles";
import api from "../../services/api"
import { useParams } from "react-router-dom"; // Import useParams
import { FaArrowLeft } from "react-icons/fa"

//{decodeURIComponent(repositorio)}
export default function Repositorio({match}){
    const { repositorio } = useParams(); 
    const [repositorioData, setRepositorio] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=> {

        async function load() {
            const nomeRepo = decodeURIComponent(repositorio);

            const [repositorioDataResponse, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`,{
                    params:{
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);
            
            setRepositorio(repositorioDataResponse.data);
            setIssues(issuesData.data);
            setLoading(false)
            
        }

        load();
        

    }, [repositorio]);

    if(loading){
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }

    return(
       <Container>
        <BackButton to="/">
            <FaArrowLeft color="#000" size={30} />
        </BackButton>
         
            <Owner>
                <img 
                    src={repositorioData.owner.avatar_url}
                    alt={repositorioData.owner.login}
                />
                <h1>{repositorioData.name}</h1>
                <p>{repositorioData.description}</p>
            </Owner>

            <IssuesList>
                {issues.map(issues =>(
                    <li key={String(issues.id)}>
                        <img src={issues.user.avatar_url} alt={issues.user.login} />

                        <div>
                            <strong>
                                <a href={issues.html_url}>{issues.title}</a>
                            
                                {issues.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>

                            <p>{issues.user.login}</p>
                        
                        </div>
                    </li>
                ))}
            </IssuesList>
        
       </Container>
    )
}