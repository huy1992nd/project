import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertPermission'
})
export class ConvertPermissionPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 3:
        return "Người chơi";
      case 6:
        return "Người quản lý site";
      case 9:
        return "root";
      default:
        return "Không rõ";
    }

    // return value == 1 ? "Quản trị viên" : value == 2 ? "Cộng tác viên" : "Không rõ";
  }

}
