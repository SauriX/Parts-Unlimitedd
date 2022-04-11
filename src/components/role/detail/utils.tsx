import IconSelector from "../../../app/common/icons/IconSelector";
import { TreeData } from "../../../app/models/shared";
import { IUserForm, IUserPermission } from "../../../app/models/user";

export const convertToTreeData = (
  targetKeys: String[],
  setPermissionsAdded: React.Dispatch<React.SetStateAction<TreeData[]>>,
  setPermissionsAvailable: React.Dispatch<React.SetStateAction<TreeData[]>>,
  setPermissionsAddedFiltered: React.Dispatch<React.SetStateAction<TreeData[]>>,
  setPermissionsAvailableFiltered: React.Dispatch<React.SetStateAction<TreeData[]>>
): ((permissions: IUserPermission[]) => void) => {
  return (permissions: IUserPermission[]) => {
    const selectedNodes: TreeData[] = [];
    const notSelectedNodes: TreeData[] = [];
    permissions = permissions.map((x) => ({
      ...x,
      asignado: targetKeys.includes(x.id.toString()),
    }));

    const menusAdded = permissions
      .filter((x) => x.asignado)
      .filter((v, i, a) => a.findIndex((x) => x.menu === v.menu) === i)
      .map((x) => ({
        title: x.menu,
        key: x.menu,
        icon: <IconSelector name={x.menu} />,
        children: [],
      }));

    const menusAvailable = permissions
      .filter((x) => !x.asignado)
      .filter((v, i, a) => a.findIndex((x) => x.menu === v.menu) === i)
      .map((x) => ({
        title: x.menu,
        key: x.menu,
        icon: <IconSelector name={x.menu} />,
        children: [],
      }));

    selectedNodes.push(...menusAdded);
    notSelectedNodes.push(...menusAvailable);

    selectedNodes.forEach((x) => {
      x.children = permissions
        .filter((p) => p.menu === x.key && p.asignado)
        .map((p) => ({ title: p.permiso, key: p.id.toString() }));
    });

    notSelectedNodes.forEach((x) => {
      x.children = permissions
        .filter((p) => p.menu === x.key && !p.asignado)
        .map((p) => ({ title: p.permiso, key: p.id.toString() }));
    });

    setPermissionsAdded(selectedNodes);
    setPermissionsAvailable(notSelectedNodes);
    setPermissionsAddedFiltered(selectedNodes);
    setPermissionsAvailableFiltered(notSelectedNodes);
  };
};

export const onTreeSelectChange = (
  permissionsAvailableFiltered: TreeData[],
  permissionsAddedFiltered: TreeData[],
  current: IUserForm | undefined,
  targetKeys: string[],
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    const availableIds = permissionsAvailableFiltered.flatMap((x) => x.children).map((x) => x?.key);
    const addedIds = permissionsAddedFiltered.flatMap((x) => x.children).map((x) => x?.key);

    const available =
      current?.permisos?.filter(
        (x) =>
          availableIds.includes(x.id.toString()) &&
          !targetKeys.includes(x.id.toString()) &&
          !sourceSelectedKeys.includes(x.id.toString())
      ) ?? [];
    const added =
      current?.permisos?.filter(
        (x) =>
          addedIds.includes(x.id.toString()) &&
          targetKeys.includes(x.id.toString()) &&
          !targetSelectedKeys.includes(x.id.toString())
      ) ?? [];

    const finalSourse: string[] = [];
    sourceSelectedKeys.forEach((x) =>
      isNaN(parseInt(x))
        ? finalSourse.push(...available.filter((y) => y.menu === x).map((y) => y.id.toString()))
        : finalSourse.push(x)
    );

    const finalTarget: string[] = [];
    targetSelectedKeys.forEach((x) =>
      isNaN(parseInt(x))
        ? finalTarget.push(...added.filter((y) => y.menu === x).map((y) => y.id.toString()))
        : finalTarget.push(x)
    );
    setSelectedKeys([...finalSourse, ...finalTarget]);
  };
};

export const onTreeSearch = (
  setNotAddedFiltered: React.Dispatch<React.SetStateAction<TreeData[]>>,
  notAdded: TreeData[],
  setAddedFiltered: React.Dispatch<React.SetStateAction<TreeData[]>>,
  added: TreeData[]
) => {
  return (direction: string, value: string) => {
    if (direction === "left") {
      setNotAddedFiltered(
        notAdded.map((x) => ({
          ...x,
          children: x.children?.filter((y) => y.title.toLowerCase().indexOf(value) >= 0),
        }))
      );
    } else {
      setAddedFiltered(
        added.map((x) => ({
          ...x,
          children: x.children?.filter((y) => y.title.toLowerCase().indexOf(value) >= 0),
        }))
      );
    }
  };
};
