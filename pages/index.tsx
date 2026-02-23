import React, { useState } from "react";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

const questions: Question[] = [
  {
    id: 1,
    text: "The spinal cord begins at the level of the:",
    options: ["Foramen magnum", "Atlas", "C3 vertebra", "Medulla oblongata only"],
    correctIndex: 0
  },
  {
    id: 2,
    text: "The spinal cord ends at the level of the:",
    options: ["Sacrum", "First and second lumbar vertebrae", "Coccyx", "T12 vertebra"],
    correctIndex: 1
  },
  {
    id: 3,
    text: "A thickening of the spinal cord that gives rise to nerves of the upper limbs is called the:",
    options: ["Lumbar enlargement", "Cervical enlargement", "Thoracic enlargement", "Brachial enlargement"],
    correctIndex: 1
  },
  {
    id: 4,
    text: "The enlargement that supplies nerves to the lower limbs is the:",
    options: ["Cervical enlargement", "Sacral enlargement", "Lumbar enlargement", "Thoracic enlargement"],
    correctIndex: 2
  },
  {
    id: 5,
    text: "In longitudinal view, the spinal cord tapers to a cone-shaped structure called the:",
    options: ["Cauda equina", "Conus medullaris", "Filum terminale", "Dorsal root"],
    correctIndex: 1
  },
  {
    id: 6,
    text: "The bundle of spinal nerves extending inferiorly from the end of the spinal cord is called the:",
    options: ["Cauda equina", "Filum terminale", "Dorsal root ganglion", "Spinal fascicle"],
    correctIndex: 0
  },
  {
    id: 7,
    text: "How many pairs of spinal nerves arise from the spinal cord?",
    options: ["21", "24", "31", "33"],
    correctIndex: 2
  },
  {
    id: 8,
    text: "Spinal nerves belong to which division of the nervous system?",
    options: ["Central nervous system", "Peripheral nervous system", "Autonomic nervous system only", "Somatic nervous system only"],
    correctIndex: 1
  },
  {
    id: 9,
    text: "The space between the dura mater and the vertebral bone that contains fat and loose connective tissue is the:",
    options: ["Subarachnoid space", "Subdural space", "Epidural space", "Ventricular space"],
    correctIndex: 2
  },
  {
    id: 10,
    text: "Cerebrospinal fluid around the spinal cord is located mainly in the:",
    options: ["Epidural space", "Subdural space", "Subarachnoid space", "Peridural cavity"],
    correctIndex: 2
  },
  {
    id: 11,
    text: "Which is the outermost meningeal layer surrounding the brain and spinal cord?",
    options: ["Arachnoid mater", "Dura mater", "Pia mater", "Epineurium"],
    correctIndex: 1
  },
  {
    id: 12,
    text: "The thin, web-like meningeal layer without blood vessels is the:",
    options: ["Dura mater", "Pia mater", "Arachnoid mater", "Epimysium"],
    correctIndex: 2
  },
  {
    id: 13,
    text: "The meningeal layer that closely follows the contours of the brain and spinal cord and contains many blood vessels is the:",
    options: ["Dura mater", "Arachnoid mater", "Pia mater", "Endoneurium"],
    correctIndex: 2
  },
  {
    id: 14,
    text: "The space between the dura mater and arachnoid mater is the:",
    options: ["Subarachnoid space", "Subdural space", "Epidural space", "Ventricular space"],
    correctIndex: 1
  },
  {
    id: 15,
    text: "A subdural hematoma is a collection of blood:",
    options: [
      "Between dura and pia mater",
      "Within the ventricles",
      "Between dura mater and arachnoid mater",
      "Between arachnoid and pia mater"
    ],
    correctIndex: 2
  },
  {
    id: 16,
    text: "Which meningeal layer continues into the vertebral canal as a strong tubular sheath surrounding the spinal cord?",
    options: ["Pia mater", "Arachnoid mater", "Dura mater", "Perineurium"],
    correctIndex: 2
  },
  {
    id: 17,
    text: "In cross-section, the meninges covering the spinal cord from outermost to innermost are:",
    options: [
      "Dura mater → pia mater → arachnoid mater",
      "Arachnoid mater → dura mater → pia mater",
      "Dura mater → arachnoid mater → pia mater",
      "Pia mater → arachnoid mater → dura mater"
    ],
    correctIndex: 2
  },
  {
    id: 18,
    text: "The clear, watery fluid that bathes the brain and spinal cord and fills the subarachnoid space is:",
    options: ["Synovial fluid", "Cerebrospinal fluid", "Interstitial fluid", "Plasma"],
    correctIndex: 1
  },
  {
    id: 19,
    text: "In the vertebral canal, which structure cushions and protects the spinal cord from the bony vertebrae?",
    options: ["Subdural space", "Subarachnoid space", "Epidural space filled with fat", "Central canal"],
    correctIndex: 2
  },
  {
    id: 20,
    text: "Infection or inflammation of the meninges is called:",
    options: ["Encephalitis", "Meningitis", "Neuritis", "Myelitis"],
    correctIndex: 1
  },
  {
    id: 21,
    text: "In a cross-section, the butterfly-shaped region in the center of the spinal cord is:",
    options: ["White matter", "Gray matter", "Meninges", "Epidural fat"],
    correctIndex: 1
  },
  {
    id: 22,
    text: "The outer region surrounding the butterfly-shaped center in a spinal cord cross-section is:",
    options: ["Gray matter", "White matter", "Pia mater", "Arachnoid mater"],
    correctIndex: 1
  },
  {
    id: 23,
    text: "The gray matter in the spinal cord is primarily composed of:",
    options: ["Myelinated axons", "Neuronal cell bodies and dendrites", "Meningeal layers", "Blood vessels only"],
    correctIndex: 1
  },
  {
    id: 24,
    text: "The white matter in the spinal cord consists mainly of:",
    options: ["Unmyelinated cell bodies", "Bone tissue", "Myelinated axons forming tracts", "Dendrites only"],
    correctIndex: 2
  },
  {
    id: 25,
    text: "In cross-section, the posterior projections of gray matter are called:",
    options: ["Anterior horns", "Lateral horns", "Posterior horns", "Gray commissures"],
    correctIndex: 2
  },
  {
    id: 26,
    text: "The anterior projections of gray matter are known as:",
    options: ["Posterior horns", "Lateral horns", "Medial horns", "Anterior horns"],
    correctIndex: 3
  },
  {
    id: 27,
    text: "The bar of gray matter that connects the two sides of the gray “butterfly” is the:",
    options: ["Gray commissure", "White commissure", "Central canal", "Funiculus"],
    correctIndex: 0
  },
  {
    id: 28,
    text: "The small channel running through the center of the gray commissure that contains cerebrospinal fluid is the:",
    options: ["Epidural canal", "Central canal", "Vertebral canal", "Spinal sinus"],
    correctIndex: 1
  },
  {
    id: 29,
    text: "The white matter is divided into anterior, lateral, and posterior regions known as:",
    options: ["Horns", "Funiculi (columns)", "Meninges", "Ganglia"],
    correctIndex: 1
  },
  {
    id: 30,
    text: "Bundles of myelinated axons in the white matter that carry information up or down the spinal cord are called:",
    options: ["Tracts", "Nuclei", "Ganglia", "Nodes"],
    correctIndex: 0
  },
  {
    id: 31,
    text: "The structure containing cell bodies of sensory neurons just outside the spinal cord is the:",
    options: ["Ventral root", "Dorsal root", "Dorsal root ganglion", "Central canal"],
    correctIndex: 2
  },
  {
    id: 32,
    text: "Which root of a spinal nerve carries sensory (afferent) impulses into the spinal cord?",
    options: ["Ventral root", "Dorsal root", "Lateral root", "Median root"],
    correctIndex: 1
  },
  {
    id: 33,
    text: "Which root carries motor (efferent) impulses out of the spinal cord to muscles or glands?",
    options: ["Ventral root", "Dorsal root", "Posterior root", "Ganglionic root"],
    correctIndex: 0
  },
  {
    id: 34,
    text: "A spinal nerve is formed by the union of:",
    options: ["Two dorsal roots", "Two ventral roots", "A dorsal and a ventral root", "Two dorsal root ganglia"],
    correctIndex: 2
  },
  {
    id: 35,
    text: "Spinal nerves are described functionally as:",
    options: ["Purely sensory", "Purely motor", "Autonomic only", "Mixed (both sensory and motor)"],
    correctIndex: 3
  },
  {
    id: 36,
    text: "In the connective tissue of a nerve, the layer that surrounds an entire nerve is the:",
    options: ["Endoneurium", "Perineurium", "Epineurium", "Myelin sheath"],
    correctIndex: 2
  },
  {
    id: 37,
    text: "The connective tissue that surrounds each fascicle (bundle) of axons is the:",
    options: ["Endoneurium", "Perineurium", "Epineurium", "Dura mater"],
    correctIndex: 1
  },
  {
    id: 38,
    text: "The delicate connective tissue that surrounds each individual nerve fiber is the:",
    options: ["Endoneurium", "Perineurium", "Epineurium", "Arachnoid mater"],
    correctIndex: 0
  },
  {
    id: 39,
    text: "Nerves that conduct impulses toward the brain or spinal cord are called:",
    options: ["Motor nerves", "Sensory nerves", "Mixed nerves", "Autonomic nerves"],
    correctIndex: 1
  },
  {
    id: 40,
    text: "Nerves that carry impulses from the CNS to muscles or glands are:",
    options: ["Sensory nerves", "Motor nerves", "Mixed nerves", "Interneurons"],
    correctIndex: 1
  },
  {
    id: 41,
    text: "Nerves that contain both sensory and motor fibers are called:",
    options: ["Mixed nerves", "Reflex nerves", "Spinal tracts", "Motor units"],
    correctIndex: 0
  },
  {
    id: 42,
    text: "A pathway that begins at receptors, travels via sensory neurons to the CNS, and then via motor neurons to effectors is called a:",
    options: ["Corticospinal tract", "Reflex arc", "Pyramidal tract", "Extrapyramidal pathway"],
    correctIndex: 1
  },
  {
    id: 43,
    text: "Ascending tracts in the spinal cord primarily carry:",
    options: ["Motor impulses to muscles", "Sensory information to the brain", "Autonomic signals to glands only", "CSF between ventricles"],
    correctIndex: 1
  },
  {
    id: 44,
    text: "Descending tracts in the spinal cord primarily carry:",
    options: ["Sensory information to the brain", "Pain only", "Motor commands from brain to effectors", "Reflexes to the skin"],
    correctIndex: 2
  },
  {
    id: 45,
    text: "Reflexes are best described as:",
    options: [
      "Slow, voluntary responses to stimuli",
      "Fast, predictable, involuntary responses to stimuli",
      "Unpredictable emotional reactions",
      "Conscious motor actions only"
    ],
    correctIndex: 1
  },
  {
    id: 46,
    text: "In the patellar (knee-jerk) reflex, the sensory neuron synapses with:",
    options: ["Another sensory neuron", "A motor neuron in the spinal cord", "A neuron in the brainstem only", "A skeletal muscle cell"],
    correctIndex: 1
  },
  {
    id: 47,
    text: "The simplest reflex pathway involves which of the following?",
    options: [
      "Receptor → sensory neuron → CNS → motor neuron → effector",
      "Receptor → CNS → effector only",
      "Receptor → motor neuron → effector",
      "Receptor → interneuron → effector"
    ],
    correctIndex: 0
  },
  {
    id: 48,
    text: "A withdrawal reflex (stepping on a tack) is protective because it:",
    options: [
      "Always increases blood pressure",
      "Moves the body part away from painful stimulus before conscious awareness",
      "Requires conscious thought before action",
      "Only affects smooth muscle"
    ],
    correctIndex: 1
  },
  {
    id: 49,
    text: "In a withdrawal reflex, the interneuron in the spinal cord:",
    options: [
      "Receives the stimulus directly from the skin",
      "Sends sensory information back to receptors",
      "Serves as the processing center between sensory and motor neurons",
      "Is not involved at all"
    ],
    correctIndex: 2
  },
  {
    id: 50,
    text: "During the withdrawal reflex of the leg, while flexor muscles contract to withdraw the foot, the extensor muscles are inhibited. This is an example of:",
    options: ["Convergence", "Divergence", "Reciprocal inhibition", "Summation"],
    correctIndex: 2
  }
];

export default function Home() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const score = answers.filter((ans, i) => ans === questions[i].correctIndex).length;



  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
      <h1>Spinal Cord & Reflex Quiz</h1>
      <p>
        Select the best answer for each question and click{" "}
        <strong>Submit</strong> to check your score.
      </p>

      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "1rem"
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
            {qIndex + 1}. {q.text}
          </div>
          <div>
            {q.options.map((opt, optIndex) => {
              const isSelected = answers[qIndex] === optIndex;
              const isCorrect = q.correctIndex === optIndex;
              const showColor = submitted && isSelected;
              const bgColor = showColor
                ? isCorrect
                  ? "#c8f7c5"
                  : "#ffc9c9"
                : "#f7f7f7";
              return (
                <button
  key={optIndex}
  onClick={(e) => {
    e.preventDefault();
    handleSelect(qIndex, optIndex);
  }}
  disabled={submitted}
  style={{
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "0.75rem 1rem",
    marginBottom: "0.5rem",
    borderRadius: 6,
    border: "2px solid #ddd",
    backgroundColor: isSelected 
      ? isCorrect 
        ? "#4CAF50" 
        : submitted ? "#f44336" : "#e3f2fd"
      : submitted ? "#f5f5f5" : "#f9f9f9",
    color: submitted && !isCorrect && isSelected ? "white" : "black",
    cursor: submitted ? "not-allowed" : "pointer",
    fontSize: "16px",
    transition: "all 0.2s"
  }}
>
  <strong>{String.fromCharCode(65 + optIndex)}.</strong> {opt}
</button>

              );
            })}
          </div>
          {submitted && (
            <div style={{ marginTop: "0.3rem", fontSize: "0.9rem" }}>
              Correct answer:{" "}
              <strong>
                {String.fromCharCode(65 + q.correctIndex)}.{" "}
                {q.options[q.correctIndex]}
              </strong>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: "1rem" }}>
        {!submitted && (
          <button
            onClick={handleSubmit}
            style={{
              padding: "0.6rem 1.2rem",
              marginRight: "0.5rem",
              borderRadius: 4,
              border: "none",
              backgroundColor: "#0070f3",
              color: "white",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
        )}
        {submitted && (
          <button
            onClick={handleReset}
            style={{
              padding: "0.6rem 1.2rem",
              marginRight: "0.5rem",
              borderRadius: 4,
              border: "none",
              backgroundColor: "#555",
              color: "white",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        )}

        {submitted && (
          <span style={{ fontWeight: 600, marginLeft: "0.5rem" }}>
            Score: {score} / {questions.length}
          </span>
        )}
      </div>
    </div>
  );
}
