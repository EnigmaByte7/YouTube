export default function Options(props){
    let array = ['Computer Science', 'DSA', 'Fireship', 'Music', 'Gaming','Comedy','C++','Cats','Maths','UI','Web Development','BlockChain'];
    return (
        <div className="flat">
            {array.map(result =>  {
                 return <div className="child" onClick={()=>{props.func(result)}}>{result}</div>
            })}
        </div>
    )
}