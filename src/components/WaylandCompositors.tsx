import {
    compositorRegistry,
    CompositorRegistryItem,
} from '../data/compositor-registry'
import { WaylandInterface } from '../model/wayland'
import { WaylandProtocolModel } from './common'

const ProtocolBox: React.FC<{
    version: number | null;
}> = ({ version }) => {
    const color = version !== null ? "bg-emerald-700" : "bg-red-900"
    const label = version !== null ? version : "x"

    return (
        <td className="border-b border-gray-300 dark:border-gray-900 p-2">
            <div className="flex justify-center">
                <div className={`w-7 h-7 leading-7 text-white rounded-lg text-center ${color}`}>
                    {label}
                </div>
            </div>
        </td>
    )
}

const ProtocolRow: React.FC<{
    interface: {
        name: string;
        versions: (number | null)[];
    }
}> = ({ interface: interfaces }) => {
    const name = (
        <td className="border-b border-gray-300 dark:border-gray-900 p-2">
            {interfaces.name}
        </td>
    )

    return (
        <tr>
            {name}
            {interfaces.versions.map((version, index) => <ProtocolBox key={index} version={version} />)}
        </tr>
    )
}


export const WaylandCompositors: React.FC<{
    element: WaylandProtocolModel
}> = ({ element }) => {
    const filteredInterfaces = element.interfaces
        .filter((waylandInterface) => {
            return compositorRegistry.some((comp) => {
                const info = comp.info.globals.find(
                    (global) => global.interface === waylandInterface.name
                )
                return info !== undefined
            })
        })

    return (
        <div className="mb-10">
            <h4
                id="compositor-support"
                className="flex items-center text-xl mt-6"
            >
                <a href="#compositor-support">
                    <span className="codicon codicon-debug-disconnect mr-1"></span>
                    Compositor Support
                </a>
            </h4>

            <div className="flex items-center overflow-x-auto">
                {filteredInterfaces.length !== 0 ? (
                    <CanIUseTable interfaces={filteredInterfaces} />
                ) : (
                    <NotFound />
                )}
            </div>
        </div>
    )
}

const CanIUseTable: React.FC<{
    interfaces: WaylandInterface[],
}> = ({ interfaces }) => {
    const SubTitle: React.FC<{ compositor: CompositorRegistryItem }> = ({
        compositor,
    }) => {
        let version = '...'
        if (compositor.info.version) {
            version = compositor.info.version
        }
        const generationTimestamp = new Date(
            compositor.info.generationTimestamp
        ).toLocaleDateString()

        return (
            <div
                className="text-xs text-gray-500 mt-1 text-left"
                title={generationTimestamp}
            >
                {version}
            </div>
        )
    }

    return (
        <table className="border-collapse bg-gray-50 rounded dark:bg-neutral-900">
            <thead>
                <tr>
                    <th className="p-4"></th>
                    {
                        interfaces.map((waylandInterface, id) => (
                            <th key={id} className="u-4 pt-1 align-bottom border-b border-gray-300 dark:border-gray-900 p-2">
                                <div className="flex flex-col justify-end items-center gap-2">
                                    <div className="[writing-mode:vertical-rl] rotate-180">
                                        {waylandInterface.name}
                                    </div>
                                </div>
                            </th>
                        ))
                    }
                </tr>
            </thead>

            <tbody className="bg-white dark:bg-neutral-800">
                {compositorRegistry.map((comp) => (
                    <tr key={comp.id} className="px-4 pt-1 align-bottom">
                        <th>
                            <div className="flex flex-row justify-start items-center gap-2">
                                <div>
                                    {comp.name}
                                </div>
                                <div className="aspect-square h-5">
                                    {comp.icon && (
                                        <img
                                            alt={comp.name}
                                            src={`/protocols/logos/${comp.icon}.svg`}
                                            className="dark:invert h-5 m-auto"
                                        />
                                    )}
                                </div>
                            </div>
                            <SubTitle compositor={comp} />
                        </th>
                        <ProtocolBox version={1} />
                        <ProtocolBox version={1} />
                        <ProtocolBox version={1} />
                        <ProtocolBox version={1} />
                        <ProtocolBox version={1} />
                        <ProtocolBox version={1} />
                        <ProtocolBox version={1} />
                        <ProtocolBox version={1} />
                    </tr>
                ))}
                {/* {rows} */}
            </tbody>
        </table>
    )
}

const NotFound: React.FC = () => {
    return (
        <>
            <span
                className="codicon codicon-search mr-3"
                style={{ fontSize: 50 }}
            ></span>
            <span className="text-xl">No compositor support found</span>
        </>
    )
}
