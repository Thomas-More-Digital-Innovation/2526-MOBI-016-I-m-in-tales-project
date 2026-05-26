import type { TagMatch } from "@/types/story.type";

interface AssignedLabelProps {
    matches: TagMatch[];
}

export function AssignedLabelsTable({ matches }: AssignedLabelProps) {
    return (
        <table className="w-full text-left border-collapse">
            <thead className="border-b-2 border-talesblu-500">
                <tr>
                    <th className="px-4 py-2 text-[10px] font-black text-talesblu-400 uppercase tracking-widest">Story</th>
                    <th className="px-4 py-2 text-[10px] font-black text-talesblu-400 uppercase tracking-widest text-right">Label</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-talesblu-100">
                {matches.map((match, i) => (
                    <tr key={i} className="hover:bg-talesorang-100/30 transition-colors group">
                        <td className="px-4 py-3 text-sm font-bold text-talesblu-800">{match.storyName}</td>
                        <td className="px-4 py-3 text-right">
                            <span className="inline-block px-2 py-1 bg-talesorang-50 text-talesorang-600 rounded-md text-[10px] font-black uppercase tracking-tight group-hover:bg-talesorang-100 transition-colors">
                                {match.label}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}