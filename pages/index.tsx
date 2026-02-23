import React, { useState } from "react";

const questions = [
  { id: 1, text: "The spinal cord begins at the level of the:", options: ["Foramen magnum", "Atlas", "C3 vertebra", "Medulla oblongata only"], correctIndex: 0 },
  { id: 2, text: "The spinal cord ends at the level of the:", options: ["Sacrum", "First and second lumbar vertebrae", "Coccyx", "T12 vertebra"], correctIndex: 1 },
  { id: 3, text: "A thickening of the spinal cord that gives rise to nerves of the upper limbs is called the:", options: ["Lumbar enlargement", "Cervical enlargement", "Thoracic enlargement", "Brachial enlargement"], correctIndex: 1 },
  { id: 4, text: "The enlargement that supplies nerves to the lower limbs is the:", options: ["Cervical enlargement", "Sacral enlargement", "Lumbar enlargement", "Thoracic enlargement"], correctIndex: 2 },
  { id: 5, text: "The spinal cord tapers to a cone-shaped structure called the:", options: ["Cauda equina", "Conus medullaris", "Filum terminale", "Dorsal root"], correctIndex: 1 },
  { id: 6, text: "The bundle of spinal nerves extending from the end of the spinal cord is called the:", options: ["Cauda equina", "Filum terminale", "Dorsal root ganglion", "Spinal fascicle"], correctIndex: 0 },
  { id: 7, text: "How many pairs of spinal nerves arise from the spinal cord?", options: ["21", "24", "31", "33"], correctIndex: 2 },
  { id: 8, text: "Spinal nerves belong to which division of the nervous system?", options: ["Central nervous system", "Peripheral nervous system", "Autonomic nervous system only", "Somatic nervous system only"], correctIndex: 1 },
  { id: 9, text: "The space between the dura mater and vertebral bone containing fat is the:", options: ["Subarachnoid space", "Subdural space", "Epidural space", "Ventricular space"], correctIndex: 2 },
  { id: 10, text: "Cerebrospinal fluid around the spinal cord is located mainly in the:", options: ["Epidural space", "Subdural space", "Subarachnoid space", "Peridural cavity"], correctIndex: 2 },
  { id: 11, text: "Which is the outermost meningeal layer surrounding the brain and spinal cord?", options: ["Arachnoid mater", "Dura mater", "Pia mater", "Epineurium"], correctIndex: 1 },
  { id: 12, text: "The thin, web-like meningeal layer without blood vessels is the:", options: ["Dura mater", "Pia mater", "Arachnoid mater", "Epimysium"], correctIndex: 2 },
  { id: 13, text: "The meningeal layer that closely follows the contours of the brain and contains many blood vessels is the:", options: ["Dura mater", "Arachnoid mater", "Pia mater", "Endoneurium"], correctIndex: 2 },
  { id: 14, text: "The space between the dura mater and arachnoid mater is the:", options: ["Subarachnoid space", "Subdural space", "Epidural space", "Ventricular space"], correctIndex: 1 },
  { id: 15, text: "A subdural hematoma is a collection of blood between:", options: ["Dura and pia mater", "Within the ventricles", "Dura mater and arachnoid mater", "Arachnoid and pia mater"], correctIndex: 2 },
  { id: 16, text: "Which meningeal layer continues into the vertebral canal as a strong tubular sheath?", options: ["Pia mater", "Arachnoid mater", "Dura mater", "Perineurium"], correctIndex: 2 },
  { id: 17, text: "The meninges from outermost to innermost are:", options: ["Dura - pia - arachnoid", "Arachnoid - dura - pia", "Dura - arachnoid - pia", "Pia - arachnoid - dura"], correctIndex: 2 },
  { id: 18, text: "The clear, watery fluid filling the subarachnoid space is:", options: ["Synovial fluid", "Cerebrospinal fluid", "Interstitial fluid", "Plasma"], correctIndex: 1 },
  { id: 19, text: "Which structure cushions the spinal cord from bony vertebrae?", options: ["Subdural space", "Subarachnoid space", "Epidural space filled with fat", "Central canal"], correctIndex: 2 },
  { id: 20, text: "Infection or inflammation of the meninges is called:", options: ["Encephalitis", "Meningitis", "Neuritis", "Myelitis"], correctIndex: 1 },
  { id: 21, text: "In a cross-section, the butterfly-shaped region in the center of the spinal cord is:", options: ["White matter", "Gray matter", "Meninges", "Epidural fat"], correctIndex: 1 },
  { id: 22, text: "The outer region surrounding the butterfly-shaped center is:", options: ["Gray matter", "White matter", "Pia mater", "Arachnoid mater"], correctIndex: 1 },
  { id: 23, text: "The gray matter in the spinal cord is primarily composed of:", options: ["Myelinated axons", "Neuronal cell bodies and dendrites", "Meningeal layers", "Blood vessels only"], correctIndex: 1 },
  { id: 24, text: "The white matter in the spinal cord consists mainly of:", options: ["Unmyelinated cell bodies", "Bone tissue", "Myelinated axons forming tracts", "Dendrites only"], correctIndex: 2 },
  { id: 25, text: "The posterior projections of gray matter are called:", options: ["Anterior horns", "Lateral horns", "Posterior horns", "Gray commissures"], correctIndex: 2 },
  { id: 26, text: "The anterior projections of gray matter are known as:", options: ["Posterior horns", "Lateral horns", "Medial horns", "Anterior horns"], correctIndex: 3 },
  { id: 27, text: "The bar of gray matter connecting the two sides of the butterfly is the:", options: ["Gray commissure", "White commissure", "Central canal", "Funiculus"], correctIndex: 0 },
  { id: 28, text: "The channel containing cerebrospinal fluid in the center of the spinal cord is the:", options: ["Epidural canal", "Central canal", "Vertebral canal", "Spinal sinus"], correctIndex: 1 },
  { id: 29, text: "The white matter is divided into anterior, lateral, and posterior regions known as:", options: ["Horns", "Funiculi (columns)", "Meninges", "Ganglia"], correctIndex: 1 },
  { id: 30, text: "Bundles of axons in white matter carrying information up or down the spinal cord are called:", options: ["Tracts", "Nuclei", "Ganglia", "Nodes"], correctIndex: 0 },
  { id: 31, text: "The structure containing cell bodies of sensory neurons just outside the spinal cord is the:", options: ["Ventral root", "Dorsal root", "Dorsal root ganglion", "Central canal"], correctIndex: 2 },
  { id: 32, text: "Which root carries sensory (afferent) impulses into the spinal cord?", options: ["Ventral root", "Dorsal root", "Lateral root", "Median root"], correctIndex: 1 },
  { id: 33, text: "Which root carries motor (efferent) impulses out of the spinal cord?", options: ["Ventral root", "Dorsal root", "Posterior root", "Ganglionic root"], correctIndex: 0 },
  { id: 34, text: "A spinal nerve is formed by the union of:", options: ["Two dorsal roots", "Two ventral roots", "A dorsal and a ventral root", "Two dorsal root ganglia"], correctIndex: 2 },
  { id: 35, text: "Spinal nerves are described functionally as:", options: ["Purely sensory", "Purely motor", "Autonomic only", "Mixed (both sensory and motor)"], correctIndex: 3 },
  { id: 36, text: "The connective tissue layer that surrounds an entire nerve is the:", options: ["Endoneurium", "Perineurium", "Epineurium", "Myelin sheath"], correctIndex: 2 },
  { id: 37, text: "The connective tissue surrounding each fascicle of axons is the:", options: ["Endoneurium", "Perineurium", "Epineurium", "Dura mater"], correctIndex: 1 },
  { id: 38, text: "The connective tissue surrounding each individual nerve fiber is the:", options: ["Endoneurium", "Perineurium", "Epineurium", "Arachnoid mater"], correctIndex: 0 },
  { id: 39, text: "Nerves that conduct impulses toward the brain or spinal cord are called:", options: ["Motor nerves", "Sensory nerves", "Mixed nerves", "Autonomic nerves"], correctIndex: 1 },
  { id: 40, text: "Nerves that carry impulses from the CNS to muscles or glands are:", options: ["Sensory nerves", "Motor nerves", "Mixed nerves", "Interneurons"], correctIndex: 1 },
  { id: 41, text: "Nerves that contain both sensory and motor fibers are called:", options: ["Mixed nerves", "Reflex nerves", "Spinal tracts", "Motor units"], correctIndex: 0 },
  { id: 42, text: "A pathway from receptors via sensory neurons to CNS then motor neurons to effectors is called a:", options: ["Corticospinal tract", "Reflex arc", "Pyramidal tract", "Extrapyramidal pathway"], correctIndex: 1 },
  { id: 43, text: "Ascending tracts in the spinal cord primarily carry:", options: ["Motor impulses to muscles", "Sensory information to the brain", "Autonomic signals to glands only", "CSF between ventricles"], correctIndex: 1 },
  { id: 44, text: "Descending tracts in the spinal cord primarily carry:", options: ["Sensory information to the brain", "Pain only", "Motor commands from brain to effectors", "Reflexes to the skin"], correctIndex: 2 },
  { id: 45, text: "Reflexes are best described as:", options: ["Slow voluntary responses", "Fast predictable involuntary responses", "Unpredictable emotional reactions", "Conscious motor actions only"], correctIndex: 1 },
  { id: 46, text: "In the patellar (knee-jerk) reflex, the sensory neuron synapses with:", options: ["Another sensory neuron", "A motor neuron in the spinal cord", "A neuron in the brainstem only", "A skeletal muscle cell"], correctIndex: 1 },
  { id: 47, text: "The simplest reflex pathway is:", options: ["Receptor - sensory neuron - CNS - motor neuron - effector", "Receptor - CNS - effector only", "Receptor - motor neuron - effector", "Receptor - interneuron - effector"], correctIndex: 0 },
  { id: 48, text: "A withdrawal reflex is protective because it:", options: ["Always increases blood pressure", "Moves body part away from pain before conscious awareness", "Requires conscious thought", "Only affects smooth muscle"], correctIndex: 1 },
  { id: 49, text: "In a withdrawal reflex, the interneuron:", options: ["Receives stimulus from skin directly", "Sends sensory info back to receptors", "Serves as processing center between sensory and motor neurons", "Is not involved"], correctIndex: 2 },
  { id: 50, text: "While flexor muscles contract in withdrawal reflex, extensor muscles are inhibited. This is:", options: ["Convergence", "Divergence", "Reciprocal inhibition", "Summation"], correctIndex: 2 }
];

export default function Home() {
  const [selected, setSelected] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const pick = (q, o) => {
    if (submitted) return;
    setSelected(prev => ({ ...prev, [q]: o }));
  };

  const score = questions.filter((q, i) => selected[i] === q.correctIndex).length;

  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"20px",fontFamily:"Arial,sans-serif"}}>
      <h1 style={{textAlign:"center",color:"#1a365d"}}>Spinal Cord and Reflex Quiz</h1>
      <p style={{textAlign:"center",color:"#555"}}>Grade 12 Anatomy - 50 Questions</p>
      {questions.map((q, qi) => (
        <div key={qi} style={{border:"1px solid #ccc",borderRadius:"8px",padding:"16px",marginBottom:"16px",background:"#fafafa"}}>
          <p style={{fontWeight:"bold",marginBottom:"12px"}}>{qi+1}. {q.text}</p>
          {q.options.map((opt, oi) => {
            const isSel = selected[qi] === oi;
            const isRight = q.correctIndex === oi;
            let bg = "#fff";
            let border = "1px solid #ccc";
            if (isSel && !submitted) { bg="#cce5ff"; border="2px solid #007bff"; }
            if (submitted && isRight) { bg="#d4edda"; border="2px solid #28a745"; }
            if (submitted && isSel && !isRight) { bg="#f8d7da"; border="2px solid #dc3545"; }
            return (
              <div
                key={oi}
                onClick={() => pick(qi, oi)}
                style={{padding:"10px 14px",marginBottom:"6px",borderRadius:"6px",border:border,background:bg,cursor:submitted?"default":"pointer",fontSize:"15px",userSelect:"none"}}
              >
                <b style={{marginRight:"8px"}}>{String.fromCharCode(65+oi)}.</b>{opt}
              </div>
            );
          })}
          {submitted && (
            <p style={{marginTop:"8px",color:"#155724",fontWeight:"bold",fontSize:"14px"}}>
              Correct: {String.fromCharCode(65+q.correctIndex)}. {q.options[q.correctIndex]}
            </p>
          )}
        </div>
      ))}
      <div style={{textAlign:"center",padding:"20px"}}>
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} style={{padding:"14px 40px",fontSize:"18px",fontWeight:"bold",background:"#28a745",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer"}}>
            Submit Quiz
          </button>
        ) : (
          <div>
            <h2 style={{color:"#155724"}}>Score: {score} / {questions.length} ({Math.round(score/questions.length*100)}%)</h2>
            <button onClick={() => { setSelected({}); setSubmitted(false); }} style={{padding:"12px 30px",fontSize:"16px",fontWeight:"bold",background:"#6c757d",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer",marginTop:"10px"}}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
