import * as fs from 'fs';
import * as path from 'path';
import { BadRequestException, Logger } from '@nestjs/common';
import type { File } from 'multer';

export class FileUtils {
  private static readonly logger = new Logger(FileUtils.name);

  /**
   * Save file to disk with the given path
   * @param filePath - Directory path to save file
   * @param file - Multer file object
   * @returns Saved file path
   */
  static saveFile(filePath: string, file: File): string {
    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s+/g, '_');
      const filename = `${timestamp}-${originalName}`;
      const fullPath = path.join(filePath, filename);

      // Save file
      fs.writeFileSync(fullPath, file.buffer);

      this.logger.log(`File saved successfully: ${fullPath}`);
      return fullPath;
    } catch (error) {
      this.logger.error(`Failed to save file: ${error}`);
      throw new BadRequestException('Failed to save file');
    }
  }

  /**
   * Delete file from disk
   * @param filePath - Full path to file
   */
  static deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`File deleted successfully: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error}`);
      throw new BadRequestException('Failed to delete file');
    }
  }

  /**
   * Get base upload directory
   * @returns Base upload directory path
   */
  static getUploadDir(): string {
    return path.join(process.cwd(), 'uploads');
  }

  /**
   * Get full directory path for a specific file category
   * @param category - File category (e.g., 'skp-perjanjian-kinerja')
   * @returns Full directory path
   */
  static getFilePath(category: string): string {
    return path.join(this.getUploadDir(), category);
  }
}
