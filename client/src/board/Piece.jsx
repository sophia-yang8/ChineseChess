export function Piece({ type, color }) {
    // Map of piece types to their Chinese characters
    const pieceSymbols = {
      general: { red: "帥", black: "將" },
      advisor: { red: "仕", black: "士" },
      elephant: { red: "相", black: "象" },
      horse: { red: "傌", black: "馬" },
      chariot: { red: "俥", black: "車" },
      cannon: { red: "炮", black: "砲" },
      soldier: { red: "兵", black: "卒" },
    }
  
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className={`
            w-[80%] h-[80%] rounded-full flex items-center justify-center
            ${color === "red" ? "bg-red-100 text-red-600 border-red-600" : "bg-gray-100 text-gray-900 border-gray-900"}
            border-2 font-bold text-lg md:text-xl
          `}
        >
          {pieceSymbols[type][color]}
        </div>
      </div>
    )
  }
  